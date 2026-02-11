const express = require('express')
const reportController = require('../controllers/reportController')
const { authenticate, authorizeRoles } = require('../middleware/auth')

const router = express.Router()

router.get(
  '/bugs.csv',
  authenticate,
  authorizeRoles('org_admin', 'project_admin', 'developer', 'tester'),
  reportController.exportBugsCsv
)

module.exports = router
