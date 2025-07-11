const { dotenv, multer, cloudinary } = require("./node_packages");
dotenv;

const defaultPicture = process.env.DEFAULT_IMG;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const multipart_form = multer();

const cors_option = {
    allowed_origin: ["https://mugivies.netlify.app", "http://localhost:4200"],
};

const cors_options = {
    origin: (origin, callback) => {
        if (cors_option.allowed_origin.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
};

// api url and port config option
const api_url = {
    url: process.env.API_URL,
    port: process.env.PORT,
};

// database cloud config
const cloud_db_options = {
    db_name: process.env.DB_DATABASE,
    db_user: process.env.DB_USERNAME,
    db_pass: process.env.DB_PASSWORD,
    db_host: process.env.DB_HOST,
    db_port: process.env.DB_PORT,
    db_connection_limit: process.env.DB_CONNECTION_LIMIT,
};

// localhost
const local_db_options = {
    db_name: `${process.env.LOCAL_NAME}_test`,
    db_user: process.env.LOCAL_USER,
    db_pass: process.env.LOCAL_PASSWORD,
    db_host: process.env.LOCAL_HOST,
    db_connection_limit: 5,
};

// jwt authentication config option
const auth_jwt = {
    secret: process.env.AUTH_SECRET,
};

//  cloudinary config
cloudinary.config({
    secure: true,
    api_key: process.env.CLOUD_APIKEY,
    api_secret: process.env.CLOUD_SECRET,
    cloud_name: process.env.CLOUD_NAME,
    // sign_url: true
});

module.exports = {
    defaultPicture,
    storage,
    upload,
    multipart_form,
    cors_options,
    api_url,
    local_db_options,
    cloud_db_options,
    auth_jwt,
    cloudinary,
};
