const { express, Readable, Op } = require('../../config/node_packages')
const { authenticate_user } = require('../../helper/jwt')
const { upload, multipart_form, cloudinary } = require('../../config/config')
const Gig = require('../../../models/gig')
const router = express.Router()

// testing gig route
router.get('', (req, res) => {
    res.status(200).json({ message: 'Gig route is working' })
})

// get my gig
router.get('/my', authenticate_user, async (req, res) => {
    const username = req.user.username
    try {
        const gigs = await Gig.findAll({ where: { postedBy: username } })
        if (!gigs || gigs <= 0) {
            return res.status(404).json({ message: 'You have not created any Gig yet' })
        }
        const gigCount = gigs.length
        return res.status(201).json({ message: 'Gigs found', gigs: gigs, gigCount })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// get all gig
router.get('/gigs', async (req, res) => {
    try {
        const gigs = await Gig.findAll()
        if (!gigs || gigs <= 0) {
            return res.status(404).json({ message: 'No gigs yet check back later' })
        }
        return res.status(201).json({ message: 'Gigs found', gigs: gigs })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// get gig by id api
router.get('/gig/:id', async (req, res) => {
    const gig_id = req.params.id
    try {
        const gig = await Gig.findByPk(gig_id)
        if (!gig) {
            return res.status(404).json({ message: 'No gig found chack back later' })
        }
        return res.status(201).json({ gig: gig })

    } catch (err) {
        return res.status(501).json({ message: 'Database error', err })
    }
})

// get newly created gig
router.get('/newgigs', async (req, res) => {
    const aWeeekAgo = new Date()
    aWeeekAgo.setDate(aWeeekAgo.getDay() - 7)
    try {
        const gig = await Gig.findAll({ where: { createdAt: { [Op.gte]: aWeeekAgo } }, limit: 10 })
        if (!gig || gig.length === 0) {
            return res.status(404).json({ message: 'No new gigs found chack back later' })
        }
        return res.status(201).json({ gig: gig })

    } catch (err) {
        console.error(err)
        return res.status(501).json({ message: 'Database error', err })
    }
})

// create gig
router.post('/create', authenticate_user, multipart_form.any(), async (req, res) => {
    const { title, type, description, date, time, contact, } = req.body
    try {
        const gig = await Gig.create({
            title: title,
            type: type,
            description: description,
            date: date,
            time: time,
            contact: contact,
            postedBy: req.user.username,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })

        return res.status(201).json({ message: 'Gig created successfully\nGo to your dashboad to complete editing your gig', gig })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// update gig
router.put('/update/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    const { description, type, date, location,
        time, contact, instruments, price
    } = req.body
    try {

        const gig = await Gig.findByPk(id)
        if (!gig) {
            return res.status(404).json({ message: 'No gig of that identity created. Create one first' })
        }

        gig.update({
            description: description,
            type: type,
            date: date,
            location, location,
            time: time,
            contact: contact,
            instruments: instruments,
            price: price,
            updatedAt: Date.now()
        }, { where: { id: id } })

        return res.status(201).json({ message: 'Gig updated successfully', gig })

    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// upload gig image
// router.put('/image/:id', authenticate_user, upload.single('image'), async (req, res) => {
//     const id = req.params.id
//     try {
//         const gig = await Gig.findByPk(id)
//         if (!gig) {
//             return res.status(404).json({ message: 'No gig of that identity created. Create one first' })
//         }

//         if (!req.file) {
//             return res.status(400).json({ message: 'No image file uploaded.' });
//         }
//         // convert the buffer to a readable stream
//         const readstream = new Readable()
//         readstream.push(req.file.buffer)
//         readstream.push(null)

//         // upload image to cloudinary directly from buffer
//         const cloudinaryResponse = await new Promise((resolve, reject) => {
//             const uploadstream = cloudinary.uploader.upload_stream({
//                 folder: 'gigs-image',
//                 allowed_formats: ['jpg', 'svg', 'png', 'webm', 'webp']
//             },
//                 (error, result) => {
//                     if (error) reject(error)
//                     else resolve(result)
//                 })

//             readstream.pipe(uploadstream)
//         })

//         // store image to the database profile picture
//         await gig.update({ image: cloudinaryResponse.secure_url, updatedAt: Date.now() })
//         return res.json({ message: 'Gig image uploaded successfully' })

//     } catch (error) {
//         console.error(error)
//         return res.status(500).json({ message: 'Database error!', error })
//     }
// })

// delete gig
router.delete('/delete/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    try {
        const gig = await Gig.findByPk(id)
        if (!gig) {
            return res.status(404).json({ message: 'No gig created or it has been deleted' })
        }

        gig.destroy({ where: { id: id } })
        return res.status(201).json({ message: 'Gig deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})


module.exports = router
