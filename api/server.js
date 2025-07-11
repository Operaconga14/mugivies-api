const { api_url, cors_options } = require("./config/config");
const { express, cookie_parser, morgan, cors } = require("./config/node_packages");
const { connectToDatabase } = require("./db/db_connection");
const { user_router, event_router, post_router, gig_router, service_router, vacancy_router, gadget_router } = require("./routes/route.controller");

const app = express()

// middleware config
app.use(cookie_parser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('tiny'))
app.use(cors(cors_options))

/**
 * LIST OF ROUTES
 * main api to test the api
 * user routes => done not completed
 * event route => done  not completed
 * gigs route => done not completed
 * service route => last to do
 * gadget route =>
 * post route => done not completed
 * vaccancies route =>
 */

// testing api
app.get(`${api_url.url}`, (req, res) => {
    res.status(200).json({ message: 'Api is working' })
})
// user router
app.use(`${api_url.url}user`, user_router)
// event router
app.use(`${api_url.url}event`, event_router)
// post router
app.use(`${api_url.url}post`, post_router)
// gig router
app.use(`${api_url.url}gig`, gig_router)
// service router
app.use(`${api_url.url}service`, service_router),
    // vacancy router
    app.use(`${api_url.url}vacancy`, vacancy_router)
// gadget router
app.use(`${api_url.url}gadget`, gadget_router)


app.listen(api_url.port, () => {
    // connect to dtabase
    connectToDatabase()
    console.log(`listening to ${api_url.port} url: http://localhost:${api_url.port}${api_url.url}`)
})
