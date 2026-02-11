const db = require('../config/db')

const createUser = async ({ name, email, passwordHash, roleId }) => {
  const [result] = await db.execute(
    'INSERT INTO users (name, email, password_hash, role_id) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, roleId]
  )
  return { id: result.insertId, name, email, roleId }
}

const findByEmail = async (email) => {
  const [rows] = await db.execute(
    `SELECT u.id, u.name, u.email, u.password_hash, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.email = ? AND u.deleted_at IS NULL`,
    [email]
  )
  return rows[0]
}

const findById = async (id) => {
  const [rows] = await db.execute(
    `SELECT u.id, u.name, u.email, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     WHERE u.id = ? AND u.deleted_at IS NULL`,
    [id]
  )
  return rows[0]
}

const findRoleIdByName = async (roleName) => {
  const [rows] = await db.execute('SELECT id FROM roles WHERE name = ?', [roleName])
  return rows[0]?.id
}

const listUsers = async ({ role } = {}) => {
  const clauses = []
  const values = []

  if (role) {
    clauses.push('r.name = ?')
    values.push(role)
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''

  const [rows] = await db.execute(
    `SELECT u.id, u.name, r.name AS role
     FROM users u
     JOIN roles r ON u.role_id = r.id
     ${where ? `${where} AND u.deleted_at IS NULL` : 'WHERE u.deleted_at IS NULL'}
     ORDER BY u.name`,
    values
  )

  return rows
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
    'UPDATE users SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id]
  )
  return result.affectedRows > 0
}

module.exports = {
  createUser,
  findByEmail,
  findById,
  findRoleIdByName,
  listUsers,
  updateUser,
  softDeleteUser
}
