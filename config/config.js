require('dotenv').config()

module.exports = {
    development: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Use true if you want to verify the server's SSL certificate
            }
        }
    },
    test: {
        username: process.env.LOCAL_USER,
        password: process.env.LOCAL_PASSWORD,
        database: `${process.env.LOCAL_NAME}_test`,
        host: process.env.LOCAL_HOST,
        dialect: 'mysql'
    },
    production: {
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        host: process.env.DB_HOST,
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false, // Use true if you want to verify the server's SSL certificate
            }
        }
    }
}
