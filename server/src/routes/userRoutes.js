const express = require('express')
const { getUsers, updateUserById, deleteUserById } = require('../controllers/userController')
const { authenticate, authorizeRoles } = require('../middleware/auth')
const { updateUserRules } = require('../validators/userValidators')
const validateRequest = require('../middleware/validate')

const router = express.Router()

router.use(authenticate)

router.get('/', authorizeRoles('Admin'), getUsers)
router.put('/:id', authorizeRoles('Admin'), updateUserRules, validateRequest, updateUserById)
router.delete('/:id', authorizeRoles('Admin'), deleteUserById)

module.exports = router
