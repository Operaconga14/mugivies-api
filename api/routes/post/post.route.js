const { express, Readable, Op } = require('../../config/node_packages')
const { authenticate_user } = require('../../helper/jwt')
const { upload, multipart_form, cloudinary } = require('../../config/config')
const Post = require('../../../models/post')
const router = express.Router()

// testing post route
router.get('', (req, res) => {
    res.status(200).json({ message: 'Post route is working' })
})

// get my post
router.get('/my', authenticate_user, async (req, res) => {
    const username = req.user.username
    try {
        const posts = await Post.findAll({ where: { postedBy: username } })
        if (!posts || posts <= 0) {
            return res.status(404).json({ message: 'You have not created any Post yet' })
        }
        const postCount = posts.length
        return res.status(201).json({ message: 'Posts found', posts: posts, postCount })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// get all post
router.get('/posts', async (req, res) => {
    try {
        const posts = await Post.findAll()
        if (!posts || posts <= 0) {
            return res.status(404).json({ message: 'No posts yet check back later' })
        }
        return res.status(201).json({ message: 'Posts found', posts: posts })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// get post by id api
router.get('/post/:id', async (req, res) => {
    const post_id = req.params.id
    try {
        const post = await Post.findByPk(post_id)
        if (!post) {
            return res.status(404).json({ message: 'No post found chack back later' })
        }
        return res.status(201).json({ post: post })

    } catch (err) {
        return res.status(501).json({ message: 'Database error', err })
    }
})

// get newly created post
router.get('/newposts', async (req, res) => {
    const aWeeekAgo = new Date()
    aWeeekAgo.setDate(aWeeekAgo.getDay() - 7)
    try {
        const post = await Post.findAll({ where: { createdAt: { [Op.gte]: aWeeekAgo } }, limit: 10 })
        if (!post || post.length === 0) {
            return res.status(404).json({ message: 'No new posts found chack back later' })
        }
        return res.status(201).json({ post: post })

    } catch (err) {
        console.error(err)
        return res.status(501).json({ message: 'Database error', err })
    }
})

// create post
router.post('/create', authenticate_user, multipart_form.any(), async (req, res) => {
    const { title, description } = req.body
    try {
        const post = await Post.create({
            title: title,
            description: description,
            postedBy: req.user.username,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })

        return res.status(201).json({ message: 'Post created successfully\nGo to your dashboad to complete editing your post', post })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// update post
router.put('/update/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    const { description, title, facebook,
        instagram, boomplay, applemusic, spotify,
        tiktok, audiomack, youtube
    } = req.body
    try {

        const post = await Post.findByPk(id)
        if (!post) {
            return res.status(404).json({ message: 'No post of that identity created. Create one first' })
        }

        post.update({
            description: description,
            title: title,
            facebook: facebook,
            instagram: instagram,
            boomplay: boomplay,
            applemusic: applemusic,
            spotify: spotify,
            tiktok: tiktok,
            audiomack: audiomack,
            youtube: youtube,
            updatedAt: Date.now()
        }, { where: { id: id } })

        return res.status(201).json({ message: 'Post updated successfully', post })

    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// upload post image
router.put('/image/:id', authenticate_user, upload.single('image'), async (req, res) => {
    const id = req.params.id
    try {
        const post = await Post.findByPk(id)
        if (!post) {
            return res.status(404).json({ message: 'No post of that identity created. Create one first' })
        }

        if (!req.file) {
            return res.status(400).json({ message: 'No image file uploaded.' });
        }
        // convert the buffer to a readable stream
        const readstream = new Readable()
        readstream.push(req.file.buffer)
        readstream.push(null)

        // upload image to cloudinary directly from buffer
        const cloudinaryResponse = await new Promise((resolve, reject) => {
            const uploadstream = cloudinary.uploader.upload_stream({
                folder: 'posts-image',
                allowed_formats: ['jpg', 'svg', 'png', 'webm', 'webp']
            },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })

            readstream.pipe(uploadstream)
        })

        // store image to the database profile picture
        await post.update({ image: cloudinaryResponse.secure_url, updatedAt: Date.now() })
        return res.json({ message: 'Post image uploaded successfully' })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// delete post
router.delete('/delete/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    try {
        const post = await Post.findByPk(id)
        if (!post) {
            return res.status(404).json({ message: 'No post created or it has been deleted' })
        }

        post.destroy({ where: { id: id } })
        return res.status(201).json({ message: 'Post deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})


module.exports = router
