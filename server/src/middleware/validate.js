const { validationResult } = require('express-validator')

const validateRequest = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    const details = errors.array()
    return res.status(400).json({
      message: details[0]?.msg || 'Invalid request',
      errors: details
    })
  }
  return next()
}

module.exports = validateRequest
