const { express, Readable, Op } = require('../../config/node_packages')
const { authenticate_user } = require('../../helper/jwt')
const { upload, multipart_form, cloudinary } = require('../../config/config')
const Vacancy = require('../../../models/vacancy')
const router = express.Router()

// testing vacancy route
router.get('', (req, res) => {
    res.status(200).json({ message: 'Vacancy route is working' })
})

// get my vacancy
router.get('/my', authenticate_user, async (req, res) => {
    const username = req.user.username
    try {
        const vacancies = await Vacancy.findAll({ where: { postedBy: username } })
        if (!vacancies || vacancies <= 0) {
            return res.status(404).json({ message: 'You have not created any Vacancy yet' })
        }
        const vacancyCount = vacancies.length
        return res.status(201).json({ message: 'Vacancies found', vacancies: vacancies, vacancyCount })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// get vacancy by id api
router.get('/vacancy/:id', async (req, res) => {
    const vacancy_id = req.params.id
    try {
        const vacancy = await Vacancy.findByPk(vacancy_id)
        if (!vacancy) {
            return res.status(404).json({ message: 'No vacancy found chack back later' })
        }
        return res.status(201).json({ vacancy: vacancy })

    } catch (err) {
        return res.status(501).json({ message: 'Database error', err })
    }
})


// get newly created vacancy
router.get('/newvacancies', async (req, res) => {
    const aWeeekAgo = new Date()
    aWeeekAgo.setDate(aWeeekAgo.getDay() - 7)
    try {
        const vacancy = await Vacancy.findAll({ where: { createdAt: { [Op.gte]: aWeeekAgo } }, limit: 10 })
        if (!vacancy || vacancy.length === 0) {
            return res.status(404).json({ message: 'No new vacancies found chack back later' })
        }
        return res.status(201).json({ vacancy: vacancy })

    } catch (err) {
        console.error(err)
        return res.status(501).json({ message: 'Database error', err })
    }
})

// get all vacancy
router.get('/vacancies', async (req, res) => {
    try {
        const vacancies = await Vacancy.findAll()
        if (!vacancies || vacancies <= 0) {
            return res.status(404).json({ message: 'No vacancies yet check back later' })
        }
        return res.status(201).json({ message: 'Vacancies found', vacancies: vacancies })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// create vacancy
router.post('/create', authenticate_user, multipart_form.any(), async (req, res) => {
    const { title, description, date, type, contact, } = req.body
    try {
        const vacancy = await Vacancy.create({
            title: title,
            description: description,
            date: date,
            type: type,
            contact: contact,
            postedBy: req.user.username,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })

        return res.status(201).json({ message: 'Vacancy created successfully\nGo to your dashboad to complete editing your vacancy', vacancy })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// update vacancy
router.put('/update/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    const { description, title, date, location,
        type, contact, price, deadline
    } = req.body
    try {

        const vacancy = await Vacancy.findByPk(id)
        if (!vacancy) {
            return res.status(404).json({ message: 'No vacancy of that identity created. Create one first' })
        }

        vacancy.update({
            description: description,
            title: title,
            date: date,
            location, location,
            type: type,
            contact: contact,
            price: price,
            deadline: deadline,
            updatedAt: Date.now()
        }, { where: { id: id } })

        return res.status(201).json({ message: 'Vacancy updated successfully', vacancy })

    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// upload vacancy image
// router.put('/image/:id', authenticate_user, upload.single('image'), async (req, res) => {
//     const id = req.params.id
//     try {
//         const vacancy = await Vacancy.findByPk(id)
//         if (!vacancy) {
//             return res.status(404).json({ message: 'No vacancy of that identity created. Create one first' })
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
//                 folder: 'vacancies-image',
//                 allowed_formats: ['jpg', 'svg', 'png', 'webm', 'webp']
//             },
//                 (error, result) => {
//                     if (error) reject(error)
//                     else resolve(result)
//                 })

//             readstream.pipe(uploadstream)
//         })

//         // store image to the database profile picture
//         await vacancy.update({ image: cloudinaryResponse.secure_url, updatedAt: Date.now() })
//         return res.json({ message: 'Vacancy image uploaded successfully' })

//     } catch (error) {
//         console.error(error)
//         return res.status(500).json({ message: 'Database error!', error })
//     }
// })

// delete vacancy
router.delete('/delete/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    try {
        const vacancy = await Vacancy.findByPk(id)
        if (!vacancy) {
            return res.status(404).json({ message: 'No vacancy created or it has been deleted' })
        }

        vacancy.destroy({ where: { id: id } })
        return res.status(201).json({ message: 'Vacancy deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})


module.exports = router
