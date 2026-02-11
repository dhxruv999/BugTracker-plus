const { body } = require('express-validator')

const createCommentRules = [
  body('comment').trim().isLength({ min: 1, max: 2000 }).withMessage('Comment required')
]

module.exports = {
  createCommentRules
}
