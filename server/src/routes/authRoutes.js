const express = require('express')
const rateLimit = require('express-rate-limit')
const { register, login, me, requestPasswordResetPublic, orgAdminResetFromLogin } = require('../controllers/authController')
const { registerRules, loginRules, requestResetRules, orgAdminResetRules } = require('../validators/authValidators')
const validateRequest = require('../middleware/validate')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

// Strict login limiter (applied only to login route)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true
})

router.post('/register', registerRules, validateRequest, register)
router.post('/login', loginLimiter, loginRules, validateRequest, login)
router.post('/request-password-reset', requestResetRules, validateRequest, requestPasswordResetPublic)
router.put('/org-admin-reset-password', orgAdminResetRules, validateRequest, orgAdminResetFromLogin)
router.get('/me', authenticate, me)

module.exports = router
