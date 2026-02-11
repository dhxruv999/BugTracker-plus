const asyncHandler = require('../middleware/asyncHandler')
const bugModel = require('../models/bugModel')
const { findById } = require('../models/userModel')
const { BUG_STATUSES, BUG_PRIORITIES } = require('../utils/constants')
const { canAccessBug } = require('../utils/access')

const createBug = asyncHandler(async (req, res) => {
  const { title, description, priority, status, assignedTo, screenshots } = req.body

  const bug = await bugModel.createBug({
    title,
    description,
    priority: BUG_PRIORITIES.includes(priority) ? priority : 'Medium',
    status: BUG_STATUSES.includes(status) ? status : 'Open',
    createdBy: req.user.id,
    assignedTo: req.user.role === 'Admin' ? assignedTo : null,
    screenshots
  })

  res.status(201).json(bug)
})

const listBugs = asyncHandler(async (req, res) => {
  const { status, priority, assignedTo } = req.query
  const filters = { status, priority }

  if (req.user.role === 'Developer') {
    filters.assignedTo = req.user.id
    const bugs = await bugModel.listBugs(filters)
    return res.json(bugs)
  }

  if (req.user.role === 'Tester') {
    const bugs = await bugModel.listBugsForTester({ status, priority, userId: req.user.id })
    return res.json(bugs)
  }

  if (assignedTo) {
    filters.assignedTo = assignedTo
  }

  const bugs = await bugModel.listBugs(filters)
  res.json(bugs)
})

const getBug = asyncHandler(async (req, res) => {
  const bug = await bugModel.getBugById(req.params.id)
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found' })
  }
  if (!canAccessBug(req.user, bug)) {
    return res.status(403).json({ message: 'Forbidden' })
  }
  return res.json(bug)
})

const updateBug = asyncHandler(async (req, res) => {
  const bug = await bugModel.getBugById(req.params.id)
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found' })
  }

  const updates = {}

  if (req.user.role === 'Admin') {
    if (req.body.title) updates.title = req.body.title
    if (req.body.description !== undefined) updates.description = req.body.description
    if (req.body.priority && BUG_PRIORITIES.includes(req.body.priority)) {
      updates.priority = req.body.priority
    }
    if (req.body.status && BUG_STATUSES.includes(req.body.status)) {
      updates.status = req.body.status
    }
    if (req.body.assignedTo !== undefined) {
      updates.assigned_to = req.body.assignedTo === '' ? null : Number(req.body.assignedTo)
    }
    if (req.body.screenshots) updates.screenshots = req.body.screenshots
  } else if (req.user.role === 'Developer') {
    if (bug.assigned_to !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    if (req.body.description !== undefined) updates.description = req.body.description
    if (req.body.priority && BUG_PRIORITIES.includes(req.body.priority)) {
      updates.priority = req.body.priority
    }
    if (req.body.screenshots) updates.screenshots = req.body.screenshots
  } else {
    return res.status(403).json({ message: 'Forbidden' })
  }

  const updated = await bugModel.updateBug(req.params.id, updates)
  return res.json(updated)
})

const deleteBug = asyncHandler(async (req, res) => {
  const bug = await bugModel.getBugById(req.params.id)
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found' })
  }

  const removed = await bugModel.deleteBug(req.params.id)
  return res.json({ success: removed })
})

const assignBug = asyncHandler(async (req, res) => {
  const { assignedTo } = req.body
  const bug = await bugModel.getBugById(req.params.id)
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found' })
  }

  const normalized = assignedTo === null || assignedTo === '' ? null : Number(assignedTo)
  if (normalized) {
    const assignee = await findById(normalized)
    if (!assignee) {
      return res.status(400).json({ message: 'Assignee not found' })
    }
  }
  const updated = await bugModel.updateBug(req.params.id, { assigned_to: normalized })
  return res.json(updated)
})

const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body
  if (!BUG_STATUSES.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' })
  }

  const bug = await bugModel.getBugById(req.params.id)
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found' })
  }

  if (req.user.role === 'Developer' && bug.assigned_to !== req.user.id) {
    return res.status(403).json({ message: 'Only assigned developer can update status' })
  }

  if (req.user.role === 'Tester' && bug.created_by !== req.user.id && bug.assigned_to !== req.user.id) {
    return res.status(403).json({ message: 'Only bug creator or assignee can update status' })
  }

  if (req.user.role === 'Tester' && !['In Progress', 'Reopened'].includes(status)) {
    return res.status(403).json({ message: 'Tester can only set status to In Progress or Reopened' })
  }

  const updated = await bugModel.updateBug(req.params.id, { status })
  return res.json(updated)
})

module.exports = {
  createBug,
  listBugs,
  getBug,
  updateBug,
  deleteBug,
  assignBug,
  updateStatus
}
