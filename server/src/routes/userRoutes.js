const express = require('express')
const {
  getUsers,
  getAssignees,
  updateUserById,
  deleteUserById,
  approveUser,
  rejectUser,
  changeRole,
  changePassword,
  requestPasswordReset,
  adminResetPassword,
  orgAdminResetPassword
} = require('../controllers/userController')
const { authenticate, authorizeRoles } = require('../middleware/auth')
const validateRequest = require('../middleware/validate')
const {
  updateUserRules,
  approveUserRules,
  changeRoleRules,
  changePasswordRules,
  requestPasswordResetRules,
  adminResetPasswordRules,
  orgAdminResetPasswordRules
} = require('../validators/userValidators')

const router = express.Router()

router.use(authenticate)

router.put('/change-password', changePasswordRules, validateRequest, changePassword)
router.post('/request-password-reset', requestPasswordResetRules, validateRequest, requestPasswordReset)
router.put('/admin-reset-password', authorizeRoles('project_admin'), adminResetPasswordRules, validateRequest, adminResetPassword)
router.put('/org-admin-reset-password', authorizeRoles('org_admin'), orgAdminResetPasswordRules, validateRequest, orgAdminResetPassword)

router.get('/assignees', getAssignees)

router.get('/', authorizeRoles('org_admin', 'project_admin'), getUsers)
router.put('/:id', authorizeRoles('org_admin', 'project_admin'), updateUserRules, validateRequest, updateUserById)
router.delete('/:id', authorizeRoles('org_admin', 'project_admin'), deleteUserById)

router.put('/:id/approve', authorizeRoles('org_admin', 'project_admin'), approveUserRules, validateRequest, approveUser)
router.put('/:id/reject', authorizeRoles('org_admin'), rejectUser)
router.put('/:id/change-role', authorizeRoles('org_admin', 'project_admin'), changeRoleRules, validateRequest, changeRole)

module.exports = router
