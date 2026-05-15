const express = require('express')

const router = express.Router()

const {
   registerStudent,
   registerFaculty,
   loginStudent,
   loginFaculty,
} = require('../controllers/authController')

const {
   validateRegister,
   validateLogin,
} = require('../middleware/validationMiddleware')

// =======================
// STUDENT ROUTES
// =======================

router.post(

   '/student/register',

   validateRegister,

   registerStudent

)

router.post(

   '/student/login',

   validateLogin,

   loginStudent

)

// =======================
// FACULTY ROUTES
// =======================

router.post(

   '/faculty/register',

   validateRegister,

   registerFaculty

)

router.post(

   '/faculty/login',

   validateLogin,

   loginFaculty

)

module.exports = router