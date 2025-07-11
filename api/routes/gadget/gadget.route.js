const { express, Readable, Op } = require('../../config/node_packages')
const { authenticate_user } = require('../../helper/jwt')
const { upload, multipart_form, cloudinary } = require('../../config/config')
const Gadget = require('../../../models/gadget')
const router = express.Router()

// testing gadget route
router.get('', (req, res) => {
    res.status(200).json({ message: 'Gadget route is working' })
})

// get my gadget
router.get('/my', authenticate_user, async (req, res) => {
    const username = req.user.username
    try {
        const gadgets = await Gadget.findAll({ where: { postedBy: username } })
        if (!gadgets || gadgets <= 0) {
            return res.status(404).json({ message: 'You have not created any Gadget yet' })
        }
        const gadgetCount = gadgets.length
        return res.status(201).json({ message: 'Gadgets found', gadgets: gadgets, gadgetCount })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// get all gadget
router.get('/gadgets', async (req, res) => {
    try {
        const gadgets = await Gadget.findAll()
        if (!gadgets || gadgets <= 0) {
            return res.status(404).json({ message: 'No gadgets yet check back later' })
        }
        return res.status(201).json({ message: 'Gadgets found', gadgets: gadgets })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// get gadget by id api
router.get('/gadget/:id', async (req, res) => {
    const gadget_id = req.params.id
    try {
        const gadget = await Gadget.findByPk(gadget_id)
        if (!gadget) {
            return res.status(404).json({ message: 'No gadget found chack back later' })
        }
        return res.status(201).json({ gadget: gadget })

    } catch (err) {
        return res.status(501).json({ message: 'Database error', err })
    }
})

// get newly created gadget
router.get('/newgadgets', async (req, res) => {
    const aWeeekAgo = new Date()
    aWeeekAgo.setDate(aWeeekAgo.getDay() - 7)
    try {
        const gadget = await Gadget.findAll({ where: { createdAt: { [Op.gte]: aWeeekAgo } }, limit: 10 })
        if (!gadget || gadget.length === 0) {
            return res.status(404).json({ message: 'No new gadgets found chack back later' })
        }
        return res.status(201).json({ gadget: gadget })

    } catch (err) {
        console.error(err)
        return res.status(501).json({ message: 'Database error', err })
    }
})

// create gadget
router.post('/create', authenticate_user, multipart_form.any(), async (req, res) => {
    const { name, description, contact, } = req.body
    try {
        const gadget = await Gadget.create({
            name: name,
            description: description,
            contact: contact,
            postedBy: req.user.username,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })

        return res.status(201).json({ message: 'Gadget created successfully\nGo to your dashboad to complete editing your gadget', gadget })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// update gadget
router.put('/update/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    const { description, name, date, location,
        time, contact, instruments, price
    } = req.body
    try {

        const gadget = await Gadget.findByPk(id)
        if (!gadget) {
            return res.status(404).json({ message: 'No gadget of that identity created. Create one first' })
        }

        gadget.update({
            description: description,
            name: name,
            date: date,
            location, location,
            time: time,
            contact: contact,
            instruments: instruments,
            price: price,
            updatedAt: Date.now()
        }, { where: { id: id } })

        return res.status(201).json({ message: 'Gadget updated successfully', gadget })

    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// upload gadget image
router.put('/image/:id', authenticate_user, multipart_form.single('image'), async (req, res) => {
    const id = req.params.id
    try {
        const gadget = await Gadget.findByPk(id)
        if (!gadget) {
            return res.status(404).json({ message: 'No gadget of that identity created. Create one first' })
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
                folder: 'gadgets-image',
                allowed_formats: ['jpg', 'svg', 'png', 'webm', 'webp']
            },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })

            readstream.pipe(uploadstream)
        })

        // append the new image url
        let existingImages = Array.isArray(gadget.image) ? gadget.image : [];
        console.log(existingImages)
        existingImages.push(cloudinaryResponse.secure_url)

        // store image to the database profile picture
        await gadget.update({ image: existingImages, updatedAt: Date.now() })
        return res.json({ message: 'Gadget image uploaded successfully' })

    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// delete gadget
router.delete('/delete/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    try {
        const gadget = await Gadget.findByPk(id)
        if (!gadget) {
            return res.status(404).json({ message: 'No gadget created or it has been deleted' })
        }

        gadget.destroy({ where: { id: id } })
        return res.status(201).json({ message: 'Gadget deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})


module.exports = router
