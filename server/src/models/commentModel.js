const db = require('../config/db')

const listComments = async (bugId) => {
  const [rows] = await db.execute(
    `SELECT c.id, c.bug_id, c.user_id, c.comment, c.created_at, c.updated_at, u.name AS author_name
     FROM bug_comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.bug_id = ? AND c.deleted_at IS NULL
     ORDER BY c.created_at ASC`,
    [bugId]
  )
  return rows
}

const createComment = async ({ bugId, userId, comment }) => {
  const [result] = await db.execute(
    'INSERT INTO bug_comments (bug_id, user_id, comment) VALUES (?, ?, ?)',
    [bugId, userId, comment]
  )
  const [rows] = await db.execute(
    `SELECT c.id, c.bug_id, c.user_id, c.comment, c.created_at, c.updated_at, u.name AS author_name
     FROM bug_comments c
     JOIN users u ON c.user_id = u.id
     WHERE c.id = ?`,
    [result.insertId]
  )
  return rows[0]
}

const getCommentById = async (id) => {
  const [rows] = await db.execute(
    'SELECT * FROM bug_comments WHERE id = ? AND deleted_at IS NULL',
    [id]
  )
  return rows[0]
}

const softDeleteComment = async (id) => {
  const [result] = await db.execute(
    'UPDATE bug_comments SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL',
    [id]
  )
  return result.affectedRows > 0
}

module.exports = {
  listComments,
  createComment,
  getCommentById,
  softDeleteComment
}
