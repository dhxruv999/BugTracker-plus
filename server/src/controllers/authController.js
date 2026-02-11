const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../middleware/asyncHandler')
const { createUser, findByEmail, findById, countUsers } = require('../models/userModel')
const { ROLES } = require('../utils/constants')

const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body

  const existing = await findByEmail(email)
  if (existing) {
    return res.status(409).json({ message: 'Email already registered' })
  }

  const totalUsers = await countUsers()
  const isFirstUser = totalUsers === 0

  const role = isFirstUser ? 'org_admin' : null
  const status = isFirstUser ? 'active' : 'pending'

  const passwordHash = await bcrypt.hash(password, 10)
  const user = await createUser({ name, email, passwordHash, role, status })

  return res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    message: isFirstUser
      ? 'Organization Admin created.'
      : 'Registration successful. Account pending approval.'
  })
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  const user = await findByEmail(email)

  if (!user) {
    return res.status(401).json({ message: 'Incorrect email or password' })
  }

  const isMatch = await bcrypt.compare(password, user.password_hash)
  if (!isMatch) {
    return res.status(401).json({ message: 'Incorrect email or password' })
  }

  if (user.status !== 'active') {
    return res.status(403).json({ message: 'Account pending approval' })
  }

  if (!ROLES.includes(user.role)) {
    return res.status(403).json({ message: 'Role not assigned. Contact admin.' })
  }

  const token = jwt.sign(
    { id: user.id, role: user.role, email: user.email, status: user.status },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
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
