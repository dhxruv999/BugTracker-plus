const asyncHandler = require('../middleware/asyncHandler')
const bugModel = require('../models/bugModel')
const { findById } = require('../models/userModel')
const { BUG_STATUSES, BUG_PRIORITIES } = require('../utils/constants')

const isAdminRole = (role) => role === 'org_admin' || role === 'project_admin'

const STATUS_TRANSITIONS = {
  developer: {
    Open: ['In Progress'],
    'In Progress': ['Resolved'],
    Reopened: ['In Progress']
  },
  tester: {
    Resolved: ['Closed', 'Reopened']
  }
}

const canTransitionStatus = (role, currentStatus, nextStatus, bug, userId) => {
  if (currentStatus === nextStatus) return true
  if (isAdminRole(role)) return true
  if (role === 'developer') {
    if (bug.assigned_to !== userId) return false
    return STATUS_TRANSITIONS.developer[currentStatus]?.includes(nextStatus)
  }
  if (role === 'tester') {
    return STATUS_TRANSITIONS.tester[currentStatus]?.includes(nextStatus)
  }
  return false
}

const createBug = asyncHandler(async (req, res) => {
  const { title, description, priority, status, assignedTo, screenshots } = req.body

  let normalizedAssignee = null
  let normalizedAssigner = null
  if (isAdminRole(req.user.role) && assignedTo) {
    const assignee = await findById(Number(assignedTo))
    if (!assignee || assignee.status !== 'active' || assignee.role !== 'developer') {
      return res.status(400).json({ message: 'Assignee must be an active developer' })
    }
    normalizedAssignee = Number(assignedTo)
    normalizedAssigner = req.user.id
  }

  const bug = await bugModel.createBug({
    title,
    description,
    priority: BUG_PRIORITIES.includes(priority) ? priority : 'Medium',
    status: BUG_STATUSES.includes(status) ? status : 'Open',
    createdBy: req.user.id,
    assignedTo: normalizedAssignee,
    assignedBy: normalizedAssigner,
    screenshots
  })

  res.status(201).json(bug)
})

const listBugs = asyncHandler(async (req, res) => {
  const { status, priority, assignedTo } = req.query
  const bugs = await bugModel.listBugs({ status, priority, assignedTo })
  res.json(bugs)
})

const getBug = asyncHandler(async (req, res) => {
  const bug = await bugModel.getBugById(req.params.id)
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found' })
  }
  return res.json(bug)
})

const updateBug = asyncHandler(async (req, res) => {
  const bug = await bugModel.getBugById(req.params.id)
  if (!bug) {
    return res.status(404).json({ message: 'Bug not found' })
  }

  const updates = {}

  if (isAdminRole(req.user.role)) {
    if (req.body.title) updates.title = req.body.title
    if (req.body.description !== undefined) updates.description = req.body.description
    if (req.body.priority && BUG_PRIORITIES.includes(req.body.priority)) {
      updates.priority = req.body.priority
    }
    if (req.body.status && BUG_STATUSES.includes(req.body.status)) {
      updates.status = req.body.status
    }
    if (req.body.assignedTo !== undefined) {
      if (req.body.assignedTo === '' || req.body.assignedTo === null) {
        updates.assigned_to = null
        updates.assigned_by = null
      } else {
        const assignee = await findById(Number(req.body.assignedTo))
        if (!assignee || assignee.status !== 'active' || assignee.role !== 'developer') {
          return res.status(400).json({ message: 'Assignee must be an active developer' })
        }
        updates.assigned_to = Number(req.body.assignedTo)
        updates.assigned_by = req.user.id
      }
    }
    if (req.body.screenshots) updates.screenshots = req.body.screenshots
  } else if (req.user.role === 'developer') {
    if (bug.assigned_to !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    if (req.body.description !== undefined) updates.description = req.body.description
    if (req.body.priority && BUG_PRIORITIES.includes(req.body.priority)) {
      updates.priority = req.body.priority
    }
    if (req.body.screenshots) updates.screenshots = req.body.screenshots
  } else if (req.user.role === 'tester') {
    if (bug.created_by !== req.user.id) {
      return res.status(403).json({ message: 'Forbidden' })
    }
    if (req.body.description !== undefined) updates.description = req.body.description
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
    if (!assignee || assignee.status !== 'active' || assignee.role !== 'developer') {
      return res.status(400).json({ message: 'Assignee must be an active developer' })
    }
  }
  const updated = await bugModel.updateBug(req.params.id, {
    assigned_to: normalized,
    assigned_by: normalized ? req.user.id : null
  })
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

  if (!canTransitionStatus(req.user.role, bug.status, status, bug, req.user.id)) {
    return res.status(403).json({ message: 'Status transition not allowed' })
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
