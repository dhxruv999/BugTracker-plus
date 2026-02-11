const { body } = require('express-validator')
const { ROLES } = require('../utils/constants')

const updateUserRules = [
  body('name').optional().trim().isLength({ min: 2 }),
  body('email').optional().isEmail()
]

const updateSelfRules = [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Valid email required')
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
  updateSelfRules,
  approveUserRules,
  changeRoleRules,
  changePasswordRules,
  requestPasswordResetRules,
  adminResetPasswordRules,
  orgAdminResetPasswordRules
}
