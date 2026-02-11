const { body } = require('express-validator')
const { ROLES } = require('../utils/constants')

const updateUserRules = [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail()
]

const approveUserRules = [
  body('role').isIn(ROLES).withMessage('Valid role required')
]

const changeRoleRules = [
  body('role').isIn(ROLES).withMessage('Valid role required')
]

const changePasswordRules = [
  body('oldPassword').isLength({ min: 6 }).withMessage('Old password required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
]

const requestPasswordResetRules = [
  body('reason').optional().isString()
]

const adminResetPasswordRules = [
  body('userId').isInt().withMessage('userId required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
]

const orgAdminResetPasswordRules = [
  body('userId').isInt().withMessage('userId required'),
  body('newPassword').isLength({ min: 8 }).withMessage('New password must be at least 8 characters'),
  body('securityPhrase').isLength({ min: 6 }).withMessage('Security phrase required')
]

module.exports = {
  updateUserRules,
  approveUserRules,
  changeRoleRules,
  changePasswordRules,
  requestPasswordResetRules,
  adminResetPasswordRules,
  orgAdminResetPasswordRules
}
