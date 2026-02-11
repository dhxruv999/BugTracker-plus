const asyncHandler = require('../middleware/asyncHandler')
const bugModel = require('../models/bugModel')
const commentModel = require('../models/commentModel')

const listComments = asyncHandler(async (req, res) => {
  const bug = await bugModel.getBugById(req.params.id)
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found' })
  }

  const comments = await commentModel.listComments(req.params.id)
  return res.json(comments)
})

const addComment = asyncHandler(async (req, res) => {
  const bug = await bugModel.getBugById(req.params.id)
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found' })
  }

  const created = await commentModel.createComment({
    bugId: req.params.id,
    userId: req.user.id,
    comment: req.body.comment
  })

  return res.status(201).json(created)
})

const deleteComment = asyncHandler(async (req, res) => {
  const bug = await bugModel.getBugById(req.params.id)
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found' })
  }

  const comment = await commentModel.getCommentById(req.params.commentId)
  if (!comment || String(comment.bug_id) !== String(req.params.id)) {
    return res.status(404).json({ message: 'Comment not found' })
  }

  if (req.user.role !== 'org_admin' && req.user.role !== 'project_admin' && comment.user_id !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden' })
  }

  await commentModel.softDeleteComment(req.params.commentId)
  return res.json({ success: true })
})

module.exports = {
  listComments,
  addComment,
  deleteComment
}
