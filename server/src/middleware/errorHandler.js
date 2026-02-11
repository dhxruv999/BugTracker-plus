const errorHandler = (err, req, res, next) => {
  const status = err.status || 500
  const isServerError = status >= 500

  let message = err.message || 'Request failed'

  if (err.code === 'ER_DUP_ENTRY') {
    message = 'Email already registered'
  }

  if (['ER_BAD_FIELD_ERROR', 'ER_NO_SUCH_TABLE', 'ER_PARSE_ERROR', 'ER_NO_DEFAULT_FOR_FIELD'].includes(err.code)) {
    message = 'Database schema mismatch. Run the latest migrations.'
  }

  if (isServerError && !err.code) {
    message = 'Something went wrong. Please try again.'
  }

  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  res.status(status).json({ message })
}

module.exports = errorHandler
