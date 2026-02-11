const asyncHandler = require('../middleware/asyncHandler')
const bugModel = require('../models/bugModel')

const buildSummary = (bugs) => {
  const byStatusMap = new Map()
  const byPriorityMap = new Map()
  const byAssigneeMap = new Map()

  bugs.forEach((bug) => {
    byStatusMap.set(bug.status, (byStatusMap.get(bug.status) || 0) + 1)
    byPriorityMap.set(bug.priority, (byPriorityMap.get(bug.priority) || 0) + 1)
    const assignee = bug.assigned_to_name || 'Unassigned'
    byAssigneeMap.set(assignee, (byAssigneeMap.get(assignee) || 0) + 1)
  })

  const byStatus = Array.from(byStatusMap.entries()).map(([status, count]) => ({ status, count }))
  const byPriority = Array.from(byPriorityMap.entries()).map(([priority, count]) => ({ priority, count }))
  const byAssignee = Array.from(byAssigneeMap.entries()).map(([assignee, count]) => ({ assignee, count }))

  return {
    total: bugs.length,
    byStatus,
    byPriority,
    byAssignee
  }
}

const getSummary = asyncHandler(async (req, res) => {
  if (req.user.role === 'Admin') {
    const [total, byStatus, byPriority, byAssignee] = await Promise.all([
      bugModel.countAll(),
      bugModel.countByStatus(),
      bugModel.countByPriority(),
      bugModel.countByAssignee()
    ])

    return res.json({
      total,
      byStatus,
      byPriority,
      byAssignee
    })
  }

  if (req.user.role === 'Developer') {
    const bugs = await bugModel.listBugs({ assignedTo: req.user.id })
    return res.json(buildSummary(bugs))
  }

  const bugs = await bugModel.listBugsForTester({ userId: req.user.id })
  return res.json(buildSummary(bugs))
})

module.exports = {
  getSummary
}
