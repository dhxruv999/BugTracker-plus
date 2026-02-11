const express = require('express')
const authRoutes = require('./authRoutes')
const bugRoutes = require('./bugRoutes')
const dashboardRoutes = require('./dashboardRoutes')
const reportRoutes = require('./reportRoutes')
const userRoutes = require('./userRoutes')
const publicRoutes = require('./publicRoutes')

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/public', publicRoutes)
router.use('/bugs', bugRoutes)
router.use('/dashboard', dashboardRoutes)
router.use('/reports', reportRoutes)
router.use('/users', userRoutes)

module.exports = router
