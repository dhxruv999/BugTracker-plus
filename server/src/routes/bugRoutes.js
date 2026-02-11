const express = require('express')
const bugController = require('../controllers/bugController')
const { authenticate, authorizeRoles } = require('../middleware/auth')
const validateRequest = require('../middleware/validate')
const {
  createBugRules,
  updateBugRules,
  updateStatusRules,
  assignBugRules
} = require('../validators/bugValidators')

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
  authorizeRoles('Admin', 'Tester'),
  updateBugRules,
  validateRequest,
  bugController.updateBug
)

router.delete('/:id', authorizeRoles('Admin', 'Tester'), bugController.deleteBug)

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

module.exports = router
