const asyncHandler = require('../middleware/asyncHandler')
const bugModel = require('../models/bugModel')
const { countPendingUsers } = require('../models/userModel')
const { BUG_STATUSES } = require('../utils/constants')

const getMetrics = asyncHandler(async (req, res) => {
  const totalBugs = await bugModel.countAll()
  const rows = await bugModel.countByStatus()
  const statusCounts = BUG_STATUSES.reduce((acc, status) => {
    acc[status] = 0
    return acc
  }, {})
  rows.forEach((row) => {
    statusCounts[row.status] = Number(row.count) || 0
  })
  const pendingApprovals = await countPendingUsers()

  res.json({
    totalBugs,
    statusCounts,
    pendingApprovals
  })
})

module.exports = {
  getMetrics
}
