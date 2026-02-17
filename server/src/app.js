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

// IMPORTANT for Docker / reverse proxy
app.set('trust proxy', 1)

// General limiter (for entire API)
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300, // allow more normal traffic
  standardHeaders: true,
  legacyHeaders: false
})

// Apply general limiter
app.use(generalLimiter)

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
