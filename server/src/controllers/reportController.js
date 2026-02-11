const { Parser } = require('json2csv')
const asyncHandler = require('../middleware/asyncHandler')
const bugModel = require('../models/bugModel')

const exportBugsCsv = asyncHandler(async (req, res) => {
  let bugs = []

  if (req.user.role === 'Admin') {
    bugs = await bugModel.listBugs({})
  } else if (req.user.role === 'Developer') {
    bugs = await bugModel.listBugs({ assignedTo: req.user.id })
  } else if (req.user.role === 'Tester') {
    bugs = await bugModel.listBugs({ createdBy: req.user.id })
  }
  const parser = new Parser({
    fields: [
      'id',
      'title',
      'description',
      'status',
      'priority',
      'created_by',
      'created_by_name',
      'assigned_to',
      'assigned_to_name',
      'created_at',
      'updated_at'
    ]
  })

  const csv = parser.parse(bugs)
  res.setHeader('Content-Type', 'text/csv')
  res.setHeader('Content-Disposition', 'attachment; filename="bugs-report.csv"')
  return res.status(200).send(csv)
})

module.exports = {
  exportBugsCsv
}
