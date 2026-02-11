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
  authorizeRoles('Admin', 'Tester'),
  createBugRules,
  validateRequest,
  bugController.createBug
)

router.put(
  '/:id',
  authorizeRoles('Admin', 'Developer'),
  updateBugRules,
  validateRequest,
  bugController.updateBug
)

router.delete('/:id', authorizeRoles('Admin'), bugController.deleteBug)

router.patch(
  '/:id/assign',
  authorizeRoles('Admin'),
  assignBugRules,
  validateRequest,
  bugController.assignBug
)

router.patch(
  '/:id/status',
  authorizeRoles('Admin', 'Developer', 'Tester'),
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
