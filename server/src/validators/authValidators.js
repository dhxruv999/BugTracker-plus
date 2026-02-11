const { body } = require('express-validator')

const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
]

const loginRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password required')
]

const requestResetRules = [
  body('email').isEmail().withMessage('Valid email required')
]

const orgAdminResetRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  body('securityPhrase').isLength({ min: 6 }).withMessage('Security phrase required')
]

module.exports = {
  registerRules,
  loginRules,
  requestResetRules,
  orgAdminResetRules
}
