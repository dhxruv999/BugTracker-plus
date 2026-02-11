const bcrypt = require('bcrypt')
const asyncHandler = require('../middleware/asyncHandler')
const { listUsers, updateUser, softDeleteUser, findById, findByEmail, listActiveDevelopers } = require('../models/userModel')
const { ROLES, ROLE_RANK } = require('../utils/constants')

const isAdminRole = (role) => role === 'org_admin' || role === 'project_admin'

const canAssignRole = (assignerRole, targetRole) => {
  if (!ROLE_RANK[assignerRole] || !ROLE_RANK[targetRole]) return false
  if (assignerRole === 'project_admin') {
    return ['developer', 'tester'].includes(targetRole)
  }
  if (assignerRole === 'org_admin') {
    return targetRole !== 'org_admin'
  }
  return false
}

const canManageUser = (assignerRole, targetRole) => {
  if (!ROLE_RANK[assignerRole] || !ROLE_RANK[targetRole]) return false
  return ROLE_RANK[assignerRole] > ROLE_RANK[targetRole]
}

const getUsers = asyncHandler(async (req, res) => {
  const role = req.query.role
  const status = req.query.status
  const resetRequested = req.query.resetRequested
  const roleFilter = role && ROLES.includes(role) ? role : null
  const statusFilter = status === 'pending' || status === 'active' ? status : null
  const resetFilter = resetRequested === 'true' ? true : resetRequested === 'false' ? false : undefined
  const users = await listUsers({ role: roleFilter, status: statusFilter, passwordResetRequested: resetFilter })
  res.json(users)
})

const getAssignees = asyncHandler(async (req, res) => {
  const developers = await listActiveDevelopers()
  res.json(developers)
})

const updateUserById = asyncHandler(async (req, res) => {
  const user = await findById(req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (!isAdminRole(req.user.role) || !canManageUser(req.user.role, user.role)) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const updates = {}
  if (req.body.name) updates.name = req.body.name
  if (req.body.email) updates.email = req.body.email

  const updated = await updateUser(req.params.id, updates)
  return res.json(updated)
})

const deleteUserById = asyncHandler(async (req, res) => {
  const user = await findById(req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (!isAdminRole(req.user.role) || !canManageUser(req.user.role, user.role)) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const removed = await softDeleteUser(req.params.id)
  return res.json({ success: removed })
})

const approveUser = asyncHandler(async (req, res) => {
  const user = await findById(req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (user.status === 'active') {
    return res.status(400).json({ message: 'User already active' })
  }

  if (user.role) {
    return res.status(400).json({ message: 'User role already assigned' })
  }

  const targetRole = req.body.role
  if (!ROLES.includes(targetRole)) {
    return res.status(400).json({ message: 'Invalid role' })
  }

  if (!canAssignRole(req.user.role, targetRole)) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  if (req.user.id === user.id) {
    return res.status(403).json({ message: 'Cannot approve yourself' })
  }

  const updated = await updateUser(req.params.id, {
    role: targetRole,
    status: 'active',
    password_reset_requested: false
  })
  return res.json(updated)
})

const rejectUser = asyncHandler(async (req, res) => {
  const user = await findById(req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (user.status === 'active') {
    return res.status(400).json({ message: 'User already active' })
  }

  if (req.user.id === user.id) {
    return res.status(403).json({ message: 'Cannot reject yourself' })
  }

  if (req.user.role !== 'org_admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const removed = await softDeleteUser(req.params.id)
  return res.json({ success: removed })
})

const changeRole = asyncHandler(async (req, res) => {
  const user = await findById(req.params.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (user.status !== 'active') {
    return res.status(400).json({ message: 'User is not active' })
  }

  if (req.user.id === user.id) {
    return res.status(403).json({ message: 'Cannot change your own role' })
  }

  const targetRole = req.body.role
  if (!ROLES.includes(targetRole)) {
    return res.status(400).json({ message: 'Invalid role' })
  }

  if (!canAssignRole(req.user.role, targetRole) || !canManageUser(req.user.role, user.role)) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const updated = await updateUser(req.params.id, { role: targetRole })
  return res.json(updated)
})

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body
  const user = await findById(req.user.id)
  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  const fullUser = await findByEmail(user.email)
  const isMatch = await bcrypt.compare(oldPassword, fullUser.password_hash)
  if (!isMatch) {
    return res.status(400).json({ message: 'Old password is incorrect' })
  }

  const passwordHash = await bcrypt.hash(newPassword, 10)
  await updateUser(req.user.id, { password_hash: passwordHash, password_reset_requested: false })
  return res.json({ success: true })
})

const requestPasswordReset = asyncHandler(async (req, res) => {
  if (!['developer', 'tester', 'project_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  await updateUser(req.user.id, { password_reset_requested: true })
  return res.json({ success: true })
})

const adminResetPassword = asyncHandler(async (req, res) => {
  if (req.user.role !== 'project_admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const targetUser = await findById(req.body.userId)
  if (!targetUser) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (targetUser.status !== 'active') {
    return res.status(400).json({ message: 'Target user is not active' })
  }

  if (!['developer', 'tester'].includes(targetUser.role)) {
    return res.status(403).json({ message: 'Target role not allowed' })
  }

  if (!targetUser.password_reset_requested) {
    return res.status(400).json({ message: 'No password reset requested' })
  }

  const passwordHash = await bcrypt.hash(req.body.newPassword, 10)
  await updateUser(req.body.userId, {
    password_hash: passwordHash,
    password_reset_requested: false
  })

  return res.json({ success: true })
})

const orgAdminResetPassword = asyncHandler(async (req, res) => {
  if (req.user.role !== 'org_admin') {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const targetUser = await findById(req.body.userId)
  if (!targetUser) {
    return res.status(404).json({ message: 'User not found' })
  }

  if (targetUser.status !== 'active') {
    return res.status(400).json({ message: 'Target user is not active' })
  }

  const isSelf = targetUser.id === req.user.id
  const allowedTargets = ['project_admin', 'developer', 'tester']
  if (!isSelf && !allowedTargets.includes(targetUser.role)) {
    return res.status(403).json({ message: 'Target role not allowed' })
  }

  if (!isSelf && !targetUser.password_reset_requested) {
    return res.status(400).json({ message: 'No password reset requested' })
  }

  const phraseHash = process.env.ORG_ADMIN_RESET_PHRASE_HASH
  if (!phraseHash) {
    return res.status(500).json({ message: 'Security phrase not configured' })
  }

  const phraseOk = await bcrypt.compare(req.body.securityPhrase, phraseHash)
  if (!phraseOk) {
    return res.status(403).json({ message: 'Invalid security phrase' })
  }

  const passwordHash = await bcrypt.hash(req.body.newPassword, 10)
  await updateUser(req.body.userId, {
    password_hash: passwordHash,
    password_reset_requested: false
  })

  return res.json({ success: true })
})

module.exports = {
  getUsers,
  getAssignees,
  updateUserById,
  deleteUserById,
  approveUser,
  rejectUser,
  changeRole,
  changePassword,
  requestPasswordReset,
  adminResetPassword,
  orgAdminResetPassword
}
