const jwt = require('jsonwebtoken')
const { findById } = require('../models/userModel')

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing or invalid token' })
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    const user = await findById(payload.id)

    if (!user) {
      return res.status(401).json({ message: 'Invalid token' })
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account pending approval' })
    }

    req.user = user
    return next()
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' })
  }
}

const authorizeRoles = (...allowedRoles) => (req, res, next) => {
  if (!req.user || !allowedRoles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  return next()
}

module.exports = {
  authenticate,
  authorizeRoles
}
