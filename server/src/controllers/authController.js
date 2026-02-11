const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../middleware/asyncHandler')
const { createUser, findByEmail, findById, findRoleIdByName } = require('../models/userModel')
const { ROLES } = require('../utils/constants')

const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  const existing = await findByEmail(email)
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' })
  }

  const roleName = ROLES.includes(role) ? role : 'Tester'
  const roleId = await findRoleIdByName(roleName)
  if (!roleId) {
    return res.status(400).json({ message: 'Invalid role' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await createUser({ name, email, passwordHash, roleId })

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: roleName
  })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await findByEmail(email)

  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const isMatch = await bcrypt.compare(password, user.password_hash)
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid credentials' })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  })
})

const me = asyncHandler(async (req, res) => {
  const user = await findById(req.user.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }
  return res.json(user)
})

module.exports = {
  register,
  login,
  me
}
