const db = require('../config/db')

const parseScreenshots = (value) => {
  if (!value) return []
  if (Array.isArray(value)) return value
  try {
    return JSON.parse(value)
  } catch (error) {
    return []
  }
}

const mapBugRow = (row) => ({
  ...row,
  screenshots: parseScreenshots(row.screenshots)
})

const createBug = async ({
  title,
  description,
  status,
  priority,
  createdBy,
  assignedTo,
  screenshots
}) => {
  const [result] = await db.execute(
    `INSERT INTO bugs (title, description, status, priority, created_by, assigned_to, screenshots)
     VALUES (?, ?, ?, ?, ?, ?, ?)` ,
    [
      title,
      description || null,
      status || 'Open',
      priority || 'Medium',
      createdBy,
      assignedTo || null,
      JSON.stringify(screenshots || [])
    ]
  )

  return getBugById(result.insertId)
}

const getBugById = async (id) => {
  const [rows] = await db.execute(
    `SELECT b.*, creator.name AS created_by_name, assignee.name AS assigned_to_name
     FROM bugs b
     JOIN users creator ON b.created_by = creator.id
     LEFT JOIN users assignee ON b.assigned_to = assignee.id
     WHERE b.id = ? AND b.deleted_at IS NULL`,
    [id]
  )
  return rows[0] ? mapBugRow(rows[0]) : null
}

const listBugs = async ({ status, priority, assignedTo, createdBy }) => {
  const clauses = []
  const values = []

  clauses.push('b.deleted_at IS NULL')

  if (status) {
    clauses.push('b.status = ?')
    values.push(status)
  }

  if (priority) {
    clauses.push('b.priority = ?')
    values.push(priority)
  }

  if (assignedTo) {
    clauses.push('b.assigned_to = ?')
    values.push(assignedTo)
  }

  if (createdBy) {
    clauses.push('b.created_by = ?')
    values.push(createdBy)
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''

  const [rows] = await db.execute(
    `SELECT b.*, creator.name AS created_by_name, assignee.name AS assigned_to_name
     FROM bugs b
     JOIN users creator ON b.created_by = creator.id
     LEFT JOIN users assignee ON b.assigned_to = assignee.id
     ${where}
     ORDER BY b.created_at DESC`,
    values
  )

  return rows.map(mapBugRow)
}

const listBugsForTester = async ({ status, priority, userId }) => {
  const clauses = ['b.deleted_at IS NULL', '(b.created_by = ? OR b.assigned_to = ?)']
  const values = [userId, userId]

  if (status) {
    clauses.push('b.status = ?')
    values.push(status)
  }

  if (priority) {
    clauses.push('b.priority = ?')
    values.push(priority)
  }

  const where = `WHERE ${clauses.join(' AND ')}`

  const [rows] = await db.execute(
    `SELECT b.*, creator.name AS created_by_name, assignee.name AS assigned_to_name
     FROM bugs b
     JOIN users creator ON b.created_by = creator.id
     LEFT JOIN users assignee ON b.assigned_to = assignee.id
     ${where}
     ORDER BY b.created_at DESC`,
    values
  )

  return rows.map(mapBugRow)
}

const updateBug = async (id, updates) => {
  const fields = []
  const values = []

  Object.entries(updates).forEach(([key, value]) => {
    fields.push(`${key} = ?`)
    if (key === 'screenshots') {
      values.push(JSON.stringify(value || []))
    } else {
      values.push(value)
    }
  })

  if (!fields.length) return getBugById(id)

  values.push(id)
  await db.execute(`UPDATE bugs SET ${fields.join(', ')} WHERE id = ?`, values)
  return getBugById(id)
}

const deleteBug = async (id) => {
  const [result] = await db.execute(
    'UPDATE bugs SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id]
  )
  return result.affectedRows > 0
}

const countAll = async () => {
  const [rows] = await db.execute('SELECT COUNT(*) AS total FROM bugs WHERE deleted_at IS NULL')
  return rows[0]?.total || 0
}

const countByStatus = async () => {
  const [rows] = await db.execute(
    'SELECT status, COUNT(*) AS count FROM bugs WHERE deleted_at IS NULL GROUP BY status'
  )
  return rows
}

const countByPriority = async () => {
  const [rows] = await db.execute(
    'SELECT priority, COUNT(*) AS count FROM bugs WHERE deleted_at IS NULL GROUP BY priority'
  )
  return rows
}

const countByAssignee = async () => {
  const [rows] = await db.execute(
    `SELECT u.name AS assignee, COUNT(*) AS count
     FROM bugs b
     LEFT JOIN users u ON b.assigned_to = u.id
     WHERE b.deleted_at IS NULL
     GROUP BY b.assigned_to`
  )
  return rows
}

module.exports = {
  createBug,
  getBugById,
  listBugs,
  listBugsForTester,
  updateBug,
  deleteBug,
  countAll,
  countByStatus,
  countByPriority,
  countByAssignee
}
