const express = require('express')
const { getUsers } = require('../controllers/userController')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.get('/', authenticate, getUsers)

module.exports = router
