const express = require('express')
const authRoutes = require('./authRoutes')
const bugRoutes = require('./bugRoutes')
const dashboardRoutes = require('./dashboardRoutes')
const reportRoutes = require('./reportRoutes')
const userRoutes = require('./userRoutes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/bugs', bugRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/reports', reportRoutes)
router.use('/users', userRoutes)

module.exports = router
