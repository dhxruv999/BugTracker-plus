const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  const isServerError = status >= 500
  const message = isServerError
    ? 'Something went wrong. Please try again.'
    : err.message || 'Request failed'

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  res.status(status).json({ message })
}

module.exports = errorHandler
