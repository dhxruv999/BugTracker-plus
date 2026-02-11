const db = require('../config/db')

const createUser = async ({ name, email, passwordHash, role = null, status = 'pending' }) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password_hash, role, status) VALUES (?, ?, ?, ?, ?)',
    [name, email, passwordHash, role, status]
  )
  return { id: result.insertId, name, email, role, status }
}

const countUsers = async () => {
  const [rows] = await db.execute('SELECT COUNT(*) AS total FROM users WHERE is_deleted = FALSE')
  return rows[0]?.total || 0
}

const findByEmail = async (email) => {
  const [rows] = await db.execute(
    `SELECT id, name, email, password_hash, role, status, password_reset_requested
     FROM users
     WHERE email = ? AND is_deleted = FALSE`,
    [email]
  )
  return rows[0]
}

const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT id, name, email, role, status, password_reset_requested
     FROM users
     WHERE id = ? AND is_deleted = FALSE`,
    [id]
  )
  return rows[0]
}

const listUsers = async ({ role, status, passwordResetRequested } = {}) => {
  const clauses = ['is_deleted = FALSE']
  const values = []

  if (role) {
    clauses.push('role = ?')
    values.push(role)
  }

  if (status) {
    clauses.push('status = ?')
    values.push(status)
  }

  if (passwordResetRequested !== undefined) {
    clauses.push('password_reset_requested = ?')
    values.push(passwordResetRequested)
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''

  const [rows] = await db.execute(
    `SELECT id, name, email, role, status, password_reset_requested
     FROM users
     ${where}
     ORDER BY created_at DESC`,
    values
  )

  return rows
}

const listActiveDevelopers = async () => {
  const [rows] = await db.execute(
    `SELECT id, name, role
     FROM users
     WHERE role = 'developer' AND status = 'active' AND is_deleted = FALSE
     ORDER BY name`
  )
  return rows
}

const countPendingUsers = async () => {
  const [rows] = await db.execute(
    `SELECT COUNT(*) AS total
     FROM users
     WHERE status = 'pending' AND is_deleted = FALSE`
  )
  return rows[0]?.total || 0
}

const updateUser = async (id, updates) => {
  const fields = []
  const values = []

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`)
    values.push(value)
  })

  if (!fields.length) return findById(id)

  values.push(id)
  await db.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, values)
  return findById(id)
}

const softDeleteUser = async (id) => {
  const [result] = await db.execute(
    'UPDATE users SET is_deleted = TRUE WHERE id = ? AND is_deleted = FALSE',
    [id]
  )
  return result.affectedRows > 0
}

module.exports = {
  createUser,
  countUsers,
  findByEmail,
  findById,
  listUsers,
  updateUser,
  softDeleteUser,
  listActiveDevelopers,
  countPendingUsers
}
