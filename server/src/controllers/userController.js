const asyncHandler = require('../middleware/asyncHandler')
const { listUsers } = require('../models/userModel')
const { ROLES } = require('../utils/constants')

const getUsers = asyncHandler(async (req, res) => {
  const role = req.query.role
  const roleFilter = role && ROLES.includes(role) ? role : null
  const users = await listUsers({ role: roleFilter })
  res.json(users)
})

module.exports = {
  getUsers
}
