const { body } = require('express-validator')
const { ROLES } = require('../utils/constants')

const registerRules = [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(ROLES).withMessage('Invalid role')
]

const loginRules = [
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password required')
]

module.exports = {
  registerRules,
  loginRules
}
