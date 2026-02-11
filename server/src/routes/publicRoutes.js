const express = require('express')
const { getMetrics } = require('../controllers/publicController')

const router = express.Router()

router.get('/metrics', getMetrics)

module.exports = router
