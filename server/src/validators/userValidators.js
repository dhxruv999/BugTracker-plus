const { body } = require('express-validator')
const { ROLES } = require('../utils/constants')

const updateUserRules = [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail(),
  body('role').optional().isIn(ROLES)
]

module.exports = {
  updateUserRules
}
