const { express, Readable, Op } = require('../../config/node_packages')
const { authenticate_user } = require('../../helper/jwt')
const { upload, multipart_form, cloudinary } = require('../../config/config')
const Service = require('../../../models/service')
const router = express.Router()

// testing service route
router.get('', (req, res) => {
    res.status(200).json({ message: 'Service route is working' })
})

// get my service
router.get('/my', authenticate_user, async (req, res) => {
    const username = req.user.username
    try {
        const services = await Service.findAll({ where: { postedBy: username } })
        if (!services || services <= 0) {
            return res.status(404).json({ message: 'You have not created any Service yet' })
        }

        const serviceCount = services.length
        return res.status(201).json({ message: 'Services found', services: services, serviceCount })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// get service by id api
router.get('/service/:id', async (req, res) => {
    const service_id = req.params.id
    try {
        const service = await Service.findByPk(service_id)
        if (!service) {
            return res.status(404).json({ message: 'No service found chack back later' })
        }
        return res.status(201).json({ service: service })

    } catch (err) {
        return res.status(501).json({ message: 'Database error', err })
    }
})

// get newly created service
router.get('/newservice', async (req, res) => {
    const aWeeekAgo = new Date()
    aWeeekAgo.setDate(aWeeekAgo.getDay() - 7)
    try {
        const service = await Service.findAll({ where: { createdAt: { [Op.gte]: aWeeekAgo } }, limit: 10 })
        if (!service || service.length === 0) {
            return res.status(404).json({ message: 'No new services found chack back later' })
        }
        return res.status(201).json({ service: service })

    } catch (err) {
        console.error(err)
        return res.status(501).json({ message: 'Database error', err })
    }
})

// get all service
router.get('/services', async (req, res) => {
    try {
        const services = await Service.findAll()
        if (!services || services <= 0) {
            return res.status(404).json({ message: 'No services yet check back later' })
        }
        return res.status(201).json({ message: 'Services found', services: services })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})


// create service
router.post('/create', authenticate_user, multipart_form.any(), async (req, res) => {
    const { title, description, date, contact, } = req.body
    try {
        const service = await Service.create({
            title: title,
            description: description,
            date: date,
            contact: contact,
            postedBy: req.user.username,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })

        return res.status(201).json({ message: 'Service created successfully\nGo to your dashboad to complete editing your service', service })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// update service
router.put('/update/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    const { description, title, date, location,
        contact, price
    } = req.body
    try {

        const service = await Service.findByPk(id)
        if (!service) {
            return res.status(404).json({ message: 'No service of that identity created. Create one first' })
        }

        service.update({
            description: description,
            title: title,
            date: date,
            location, location,
            contact: contact,
            price: price,
            updatedAt: Date.now()
        }, { where: { id: id } })

        return res.status(201).json({ message: 'Service updated successfully', service })

    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// upload service image
// router.put('/image/:id', authenticate_user, upload.single('image'), async (req, res) => {
//     const id = req.params.id
//     try {
//         const service = await Service.findByPk(id)
//         if (!service) {
//             return res.status(404).json({ message: 'No service of that identity created. Create one first' })
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
//                 folder: 'services-image',
//                 allowed_formats: ['jpg', 'svg', 'png', 'webm', 'webp']
//             },
//                 (error, result) => {
//                     if (error) reject(error)
//                     else resolve(result)
//                 })

//             readstream.pipe(uploadstream)
//         })

//         // store image to the database profile picture
//         await service.update({ image: cloudinaryResponse.secure_url, updatedAt: Date.now() })
//         return res.json({ message: 'Service image uploaded successfully' })

//     } catch (error) {
//         console.error(error)
//         return res.status(500).json({ message: 'Database error!', error })
//     }
// })

// delete service
router.delete('/delete/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    try {
        const service = await Service.findByPk(id)
        if (!service) {
            return res.status(404).json({ message: 'No service created or it has been deleted' })
        }

        service.destroy({ where: { id: id } })
        return res.status(201).json({ message: 'Service deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})


module.exports = router
