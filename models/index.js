const { Sequelize } = require('sequelize')
const config = require('../config/config')[process.env.NODE_ENV || 'test']

const sequelize = new Sequelize(config.database, config.username, config.password, config)

module.exports = { sequelize }
