const express = require('express')

const router = express.Router()

const {
   registerStudent,
   registerFaculty,
   loginStudent,
   loginFaculty
} = require('../controllers/authController')

router.post('/student/register', registerStudent)

router.post('/faculty/register', registerFaculty)

router.post('/student/login', loginStudent)

router.post('/faculty/login', loginFaculty)

module.exports = router