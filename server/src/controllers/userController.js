const asyncHandler = require('../middleware/asyncHandler')
const { listUsers, updateUser, softDeleteUser, findRoleIdByName, findById } = require('../models/userModel')
const { ROLES } = require('../utils/constants')

const getUsers = asyncHandler(async (req, res) => {
  const role = req.query.role
  const roleFilter = role && ROLES.includes(role) ? role : null
  const users = await listUsers({ role: roleFilter })
  res.json(users)
})

const updateUserById = asyncHandler(async (req, res) => {
  const user = await findById(req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const updates = {}
  if (req.body.name) updates.name = req.body.name
  if (req.body.email) updates.email = req.body.email

  if (req.body.role) {
    const roleName = ROLES.includes(req.body.role) ? req.body.role : null
    if (!roleName) {
      return res.status(400).json({ message: 'Invalid role' })
    }
    const roleId = await findRoleIdByName(roleName)
    if (!roleId) {
      return res.status(400).json({ message: 'Invalid role' })
    }
    updates.role_id = roleId
  }

  const updated = await updateUser(req.params.id, updates)
  return res.json(updated)
})

const deleteUserById = asyncHandler(async (req, res) => {
  const removed = await softDeleteUser(req.params.id)
  if (!removed) {
    return res.status(404).json({ message: 'User not found' })
  }
  return res.json({ success: true })
})

module.exports = {
  getUsers,
  updateUserById,
  deleteUserById
}
