const { express, Readable, Op } = require("../../config/node_packages");
const Event = require('../../../models/event');
const { authenticate_user } = require("../../helper/jwt");
const { multipart_form, upload, cloudinary } = require("../../config/config");

const router = express.Router()


// testing event route
router.get('', (req, res) => {
    res.status(200).json({ message: 'Event route is working' })
})

// get my event
router.get('/my', authenticate_user, async (req, res) => {
    const username = req.user.username
    try {
        const events = await Event.findAll({ where: { postedBy: username } })
        if (!events || events == 0) {
            return res.status(404).json({ message: 'You have not created any Event yet' })
        }
        const eventCount = events.length

        return res.status(201).json({ message: 'Events found', events: events, eventCount })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// get event by id api
router.get('/event/:id', async (req, res) => {
    const event_id = req.params.id
    try {
        const event = await Event.findByPk(event_id)
        if (!event) {
            return res.status(404).json({ message: 'No events found chack back later' })
        }
        return res.status(201).json({ event: event })

    } catch (err) {
        return res.status(501).json({ message: 'Database error', err })
    }
})

// get all event
router.get('/events', async (req, res) => {
    try {
        const events = await Event.findAll()
        if (!events || events <= 0) {
            return res.status(404).json({ message: 'No events yet check back later' })
        }
        return res.status(201).json({ message: 'Events found', events: events })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// get newly created event
router.get('/newevents', async (req, res) => {
    const aWeeekAgo = new Date()
    aWeeekAgo.setDate(aWeeekAgo.getDay() - 7)
    try {
        const event = await Event.findAll({ where: { createdAt: { [Op.gte]: aWeeekAgo } }, limit: 10 })
        if (!event || event.length === 0) {
            return res.status(404).json({ message: 'No new events found chack back later' })
        }
        return res.status(201).json({ event: event })

    } catch (err) {
        console.error(err)
        return res.status(501).json({ message: 'Database error', err })
    }
})

// create event
router.post('/create', authenticate_user, multipart_form.any(), async (req, res) => {
    const { title, description, time, date, contact } = req.body
    try {
        const event = await Event.create({
            title: title,
            description: description,
            time: time,
            date: date,
            contact: contact,
            postedBy: req.user.username,
            createdAt: Date.now(),
            updatedAt: Date.now()
        })

        return res.status(201).json({ message: 'Event created successfully\nGo to your dashboad to complete editing your event', event })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})
// update event
router.put('/update/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    const { genre, location, date, time, contact, description, title } = req.body
    try {

        const event = await Event.findByPk(id)
        if (!event) {
            return res.status(404).json({ message: 'No event of that identity created. Create one first' })
        }

        event.update({
            genre: genre,
            location: location,
            date: date,
            time: time,
            contact: contact,
            description: description,
            title: title,
            updatedAt: Date.now()
        }, { where: { id: id } })

        return res.status(201).json({ message: 'Event updated successfully', event })

    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// upload event image
router.put('/flyer/:id', authenticate_user, upload.single('image'), async (req, res) => {
    const id = req.params.id
    try {
        const event = await Event.findByPk(id)
        if (!event) {
            return res.status(404).json({ message: 'No event of that identity created. Create one first' })
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
                folder: 'events-image',
                allowed_formats: ['jpg', 'svg', 'png', 'webm', 'webp']
            },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })

            readstream.pipe(uploadstream)
        })

        // store image to the database profile picture
        await event.update({ image: cloudinaryResponse.secure_url, updatedAt: Date.now() })
        return res.json({ message: 'Event image uploaded successfully' })

    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

// delete event
router.delete('/delete/:id', authenticate_user, async (req, res) => {
    const id = req.params.id
    try {
        const event = await Event.findByPk(id)
        if (!event) {
            return res.status(404).json({ message: 'No event created or it has been deleted' })
        }

        event.destroy({ where: { id: id } })
        return res.status(201).json({ message: 'Event deleted successfully' })
    } catch (error) {
        return res.status(500).json({ message: 'Database error!', error })
    }
})

module.exports = router
