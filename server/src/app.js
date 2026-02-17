const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const envFileOverride = process.env.ENV_FILE
  ? path.resolve(process.cwd(), process.env.ENV_FILE)
  : null
const envByNodeEnv = process.env.NODE_ENV
  ? path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`)
  : null
const defaultEnv = path.resolve(process.cwd(), '.env')

const resolvedEnv =
  (envFileOverride && fs.existsSync(envFileOverride) && envFileOverride) ||
  (envByNodeEnv && fs.existsSync(envByNodeEnv) && envByNodeEnv) ||
  (fs.existsSync(defaultEnv) && defaultEnv)

if (resolvedEnv) {
  dotenv.config({ path: resolvedEnv })
} else {
  dotenv.config()
}
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const routes = require('./routes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

const origins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(',').map((origin) => origin.trim())
  : '*'

app.use(helmet())
const originSetting = origins === '*' ? '*' : origins

app.use(
  cors({
    origin: originSetting,
    credentials: originSetting !== '*'
  })
)

app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'))

app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
    max: Number(process.env.RATE_LIMIT_MAX || 100),
    standardHeaders: true,
    legacyHeaders: false
  })
)

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'BugTracker+ API',
    timestamp: new Date().toISOString()
  });
});

app.use('/api', routes)
app.use(errorHandler)

module.exports = app
