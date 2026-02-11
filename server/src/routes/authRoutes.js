const express = require('express')
const { register, login, me, requestPasswordResetPublic, orgAdminResetFromLogin } = require('../controllers/authController')
const { registerRules, loginRules, requestResetRules, orgAdminResetRules } = require('../validators/authValidators')
const validateRequest = require('../middleware/validate')
const { authenticate } = require('../middleware/auth')

const router = express.Router()

router.post('/register', registerRules, validateRequest, register)
router.post('/login', loginRules, validateRequest, login)
router.post('/request-password-reset', requestResetRules, validateRequest, requestPasswordResetPublic)
router.put('/org-admin-reset-password', orgAdminResetRules, validateRequest, orgAdminResetFromLogin)
router.get('/me', authenticate, me)

module.exports = router
