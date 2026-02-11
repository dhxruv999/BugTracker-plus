const express = require('express')
const bugController = require('../controllers/bugController')
const commentController = require('../controllers/commentController')
const { authenticate, authorizeRoles } = require('../middleware/auth')
const validateRequest = require('../middleware/validate')
const {
  createBugRules,
  updateBugRules,
  updateStatusRules,
  assignBugRules
} = require('../validators/bugValidators')
const { createCommentRules } = require('../validators/commentValidators')

const router = express.Router()

router.use(authenticate)

router.get('/', bugController.listBugs)
router.get('/:id', bugController.getBug)

router.post(
  '/',
  authorizeRoles('org_admin', 'project_admin', 'tester'),
  createBugRules,
  validateRequest,
  bugController.createBug
)

router.put(
  '/:id',
  authorizeRoles('org_admin', 'project_admin', 'developer', 'tester'),
  updateBugRules,
  validateRequest,
  bugController.updateBug
)

router.delete('/:id', authorizeRoles('org_admin'), bugController.deleteBug)

router.patch(
  '/:id/assign',
  authorizeRoles('org_admin', 'project_admin'),
  assignBugRules,
  validateRequest,
  bugController.assignBug
)

router.patch(
  '/:id/status',
  authorizeRoles('org_admin', 'project_admin', 'developer', 'tester'),
  updateStatusRules,
  validateRequest,
  bugController.updateStatus
)

router.get('/:id/comments', commentController.listComments)
router.post(
  '/:id/comments',
  createCommentRules,
  validateRequest,
  commentController.addComment
)
router.delete('/:id/comments/:commentId', commentController.deleteComment)

module.exports = router
