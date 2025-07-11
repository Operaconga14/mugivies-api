const user_router = require('./user/user.route')
const event_router = require('./event/event.route')
const post_router = require('./post/post.route')
const gig_router = require('./gigs/gig.route')
const service_router = require('./service/service.route')
const vacancy_router = require('./vacancy/vacancy.route')
const gadget_router = require('./gadget/gadget.route')

module.exports = {
    user_router,
    event_router,
    post_router,
    gig_router,
    service_router,
    vacancy_router,
    gadget_router
}
