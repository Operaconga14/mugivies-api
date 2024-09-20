const { express, jwt, cookie_parser, Readable } = require("../../config/node_packages");
const router = express.Router();
const User = require('../../../models/user');
const { auth_jwt, defaultPicture, upload, cloudinary, multipart_form } = require("../../config/config");
const { authenticate_user } = require('../../helper/jwt');
const { where } = require("sequelize");


// middleware
router.use(cookie_parser());

// testing user route
router.get('', (req, res) => {
    res.status(200).json({ message: 'User route is working' });
});

// register user
router.post('/auth/register', async (req, res) => {
    const { name, email, username, role, password } = req.body;
    try {
        const existingEmail = await User.getUserByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const existingUserByUsername = await User.getUserByUsername(username);
        if (existingUserByUsername) {
            return res.status(400).json({ message: 'Username already in use' });
        }

        const user = await User.create({
            name: name,
            email: email,
            username: username,
            role: role,
            password: password,
            picture: defaultPicture
        });
        res.status(201).json({ message: 'Registration successful', user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Database error!', error });
    }
});

// login route
router.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({
            where: { email: email }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found or wrong email and password' });
        }

        // Compare password
        const isMatch = await user.validPassword(password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Wrong password' });
        }

        // Generate a JWT token
        const payload = { username: user.username };
        const token = jwt.sign(payload, auth_jwt.secret, { expiresIn: '1d' });

        // Store the token in a cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        res.status(201).json({ message: 'Login successfully', token });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Database error!', error });
    }
});

// profile details
router.get('/me', authenticate_user, async (req, res) => {
    try {
        const username = req.user.username;
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // show user details
        res.status(201).json({ user: user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Database error!', error });
    }
});

// update profile
router.put('/me/update', authenticate_user, async (req, res) => {
    const username = req.user.username;
    const {
        role, contact, facebook, instagram,
        youtube, audiomack, tiktok, boomplay,
        applemusic, spotify, genre, bio, collaborations,
        awards, location
    } = req.body;

    try {
        const user = await User.findOne({ where: { username: username } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.update({
            role: role, contact: contact, facebook: facebook, instagram: instagram, youtube: youtube,
            audiomack: audiomack, tiktok: tiktok, boomplay: boomplay,
            applemusic: applemusic, spotify: spotify, genre: genre,
            bio: bio, collaborations: collaborations,
            awards: awards, location: location,
            updatedAt: Date.now()
        },
            { where: { username: username } }
        );

        return res.status(201).json({ message: 'User updated successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error });
    }
});

// upload profile image
router.put('/picture', authenticate_user, upload.single('picture'), async (req, res) => {
    const username = req.user.username;
    console.log(req.file); // Check if the file is received correctly
    console.log(req.user);
    console.log('Hello');
    try {
        const user = await User.findOne({ where: { username: username }, attributes: { exclude: ['password'] } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // convert the buffer to a readable stream
        const readstream = new Readable();
        readstream.push(req.file.buffer);
        readstream.push(null);

        // upload image to cloudinary directly from buffer
        const cloudinaryResponse = await new Promise((resolve, reject) => {
            const uploadstream = cloudinary.uploader.upload_stream({
                folder: 'profile-image',
                allowed_formats: ['jpg', 'svg', 'png', 'webm', 'webp']
            },
                (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });

            readstream.pipe(uploadstream);
        });

        console.log(req.file); // Check if the file is received correctly
        console.log(req.user);

        // store image to the database profile picture
        await user.update({ picture: cloudinaryResponse.secure_url, updatedAt: Date.now() }, { where: { username: username } });
        return res.json({ message: 'Profile image uploaded successfully' });


    } catch (error) {
        console.log('Hello');

        console.error(error);
        return res.status(500).json({ message: 'Database error!', error });
    }
});

router.delete('/delete', authenticate_user, async (req, res) => {
    const username = req.user.username;
    try {
        const user = await User.findOne({ where: { username: username }, attributes: { exclude: ['password'] } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy();
        return res.status(201).json({ message: 'Account Deleted successfully' });

    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error });
    }
});

module.exports = router;
