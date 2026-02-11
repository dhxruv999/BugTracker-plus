const app = require('./app')
const db = require('./config/db')

const port = process.env.PORT || 4000

const start = async () => {
  try {
    await db.query('SELECT 1')
    app.listen(port, () => {
      console.log(`BugTracker+ API running on port ${port}`)
    })
  } catch (error) {
    console.error('Failed to connect to database:', error.message)
    process.exit(1)
  }
}

start()
