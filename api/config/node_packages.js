// Node module packages installation and configuration
const jwt = require('jsonwebtoken')
const morgan = require('morgan')
const cors = require('cors')
const cloudinary = require('cloudinary').v2
const cookie_parser = require('cookie-parser')
const express = require('express')
const body_parser = require('body-parser')
const dotenv = require('dotenv').config()
const multer = require('multer')
const fs = require('fs')
const { Readable } = require('stream')
const moment = require('moment')
const { Op } = require('sequelize')
const cron = require('node-cron')

module.exports = {
    jwt,
    morgan,
    cors,
    cloudinary,
    cookie_parser,
    express,
    dotenv,
    body_parser,
    multer,
    fs,
    Readable,
    moment,
    Op,
    cron
}
