const mysql2 = require('mysql2')
const { cloud_db_options } = require('../config/config')


const mysql = mysql2.createConnection({
    host: cloud_db_options.db_host,
    database: cloud_db_options.db_name,
    user: cloud_db_options.db_user,
    password: cloud_db_options.db_pass,
    connectionLimit: 5,
    connectTimeout: 600000,
    ssl: {
        rejectUnauthorized: false
    }
})

// const mysql = mysql2.createConnection({
//     host: 'localhost',
//     database: 'mugivies_test',
//     user: 'root',
//     password: 'Operaconga@12',
//     connectionLimit: 5,
//     connectTimeout: 600000,
//     ssl: false
// })


// connect to local database
async function connectToDatabase() {
    mysql.connect((error) => {
        if (error) {
            return console.error('Error connecting to the database:', error)
        }
        return console.log('Connected to the database.')
    })
}


module.exports = {
    connectToDatabase
}
