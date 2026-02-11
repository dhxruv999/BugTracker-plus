const asyncHandler = require('../middleware/asyncHandler')
const bugModel = require('../models/bugModel')

const getSummary = asyncHandler(async (req, res) => {
  const [total, byStatus, byPriority, byAssignee] = await Promise.all([
    bugModel.countAll(),
    bugModel.countByStatus(),
    bugModel.countByPriority(),
    bugModel.countByAssignee()
  ])

  res.json({
    total,
    byStatus,
    byPriority,
    byAssignee
  })
})

module.exports = {
  getSummary
}
