const express = require('express')
const { register, login, me } = require('../controllers/authController')
const { registerRules, loginRules } = require('../validators/authValidators')
const validateRequest = require('../middleware/validate')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.post('/register', registerRules, validateRequest, register)
router.post('/login', loginRules, validateRequest, login)
router.get('/me', authenticate, me)

module.exports = router
