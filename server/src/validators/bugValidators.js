const { body } = require('express-validator')
const { BUG_STATUSES, BUG_PRIORITIES } = require('../utils/constants')

const createBugRules = [
  body('title').trim().isLength({ min: 3 }).withMessage('Title is required'),
  body('description').optional().isString(),
  body('status').optional().isIn(BUG_STATUSES),
  body('priority').optional().isIn(BUG_PRIORITIES),
  body('assignedTo').optional().isInt(),
  body('screenshots').optional().isArray()
]

const updateBugRules = [
  body('title').optional().trim().isLength({ min: 3 }),
  body('description').optional().isString(),
  body('priority').optional().isIn(BUG_PRIORITIES),
  body('screenshots').optional().isArray()
]

const updateStatusRules = [
  body('status').isIn(BUG_STATUSES)
]

const assignBugRules = [
  body('assignedTo')
    .custom((value) => {
      if (value === null || value === '') return true
      const parsed = Number(value)
      return Number.isInteger(parsed)
    })
    .withMessage('assignedTo must be a user id or null')
]

module.exports = {
  createBugRules,
  updateBugRules,
  updateStatusRules,
  assignBugRules
}
