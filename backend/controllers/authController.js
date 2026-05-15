const User = require('../models/userModel')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Generate JWT
const generateToken = (id) => {

   return jwt.sign(

      { id },

      process.env.JWT_SECRET,

      {
         expiresIn: '30d',
      }

   )
}

// ==========================
// REGISTER STUDENT
// ==========================

const registerStudent = async (req, res) => {

   const {
      name,
      email,
      password,
   } = req.body

   // Validate fields

   if (!name || !email || !password) {

      return res.status(400).json({

         message: 'Please add all fields',

      })
   }

   // Password validation

   if (password.length < 6) {

      return res.status(400).json({

         message:
            'Password must be at least 6 characters',

      })
   }

   // Student mail validation

   if (
      !email.endsWith(
         '@cb.students.amrita.edu'
      )
   ) {

      return res.status(400).json({

         message:
            'Use student college email',

      })
   }

   // Check existing user

   const userExists = await User.findOne({
      email,
   })

   if (userExists) {

      return res.status(400).json({

         message: 'User already exists',

      })
   }

   // Hash password

   const salt = await bcrypt.genSalt(10)

   const hashedPassword =
      await bcrypt.hash(password, salt)

   // Create user

   const user = await User.create({

      name,

      email,

      password: hashedPassword,

      role: 'student',

   })

   // Response

   if (user) {

      res.status(201).json({

         _id: user._id,

         name: user.name,

         email: user.email,

         role: user.role,

         token: generateToken(user._id),

      })

   } else {

      res.status(400).json({

         message: 'Invalid user data',

      })
   }
}

// ==========================
// REGISTER FACULTY
// ==========================

const registerFaculty = async (req, res) => {

   const {
      name,
      email,
      password,
   } = req.body

   // Validate fields

   if (!name || !email || !password) {

      return res.status(400).json({

         message: 'Please add all fields',

      })
   }

   // Password validation

   if (password.length < 6) {

      return res.status(400).json({

         message:
            'Password must be at least 6 characters',

      })
   }

   // Faculty mail validation

   if (
      !email.endsWith('@cb.amrita.edu')
   ) {

      return res.status(400).json({

         message:
            'Use faculty college email',

      })
   }

   // Check existing user

   const userExists = await User.findOne({
      email,
   })

   if (userExists) {

      return res.status(400).json({

         message: 'User already exists',

      })
   }

   // Hash password

   const salt = await bcrypt.genSalt(10)

   const hashedPassword =
      await bcrypt.hash(password, salt)

   // Create user

   const user = await User.create({

      name,

      email,

      password: hashedPassword,

      role: 'faculty',

   })

   // Response

   if (user) {

      res.status(201).json({

         _id: user._id,

         name: user.name,

         email: user.email,

         role: user.role,

         token: generateToken(user._id),

      })

   } else {

      res.status(400).json({

         message: 'Invalid user data',

      })
   }
}

// ==========================
// LOGIN STUDENT
// ==========================

const loginStudent = async (req, res) => {

   const {
      email,
      password,
   } = req.body

   // Validate student mail

   if (
      !email.endsWith(
         '@cb.students.amrita.edu'
      )
   ) {

      return res.status(400).json({

         message:
            'Use student college email',

      })
   }

   // Find ONLY student

   const user = await User.findOne({

      email,

      role: 'student',

   })

   // Compare password

   if (
      user &&
      (await bcrypt.compare(
         password,
         user.password
      ))
   ) {

      res.status(200).json({

         _id: user._id,

         name: user.name,

         email: user.email,

         role: user.role,

         token: generateToken(user._id),

      })

   } else {

      res.status(400).json({

         message: 'Invalid credentials',

      })
   }
}

// ==========================
// LOGIN FACULTY
// ==========================

const loginFaculty = async (req, res) => {

   const {
      email,
      password,
   } = req.body

   // Validate faculty mail

   if (
      !email.endsWith('@cb.amrita.edu')
   ) {

      return res.status(400).json({

         message:
            'Use faculty college email',

      })
   }

   // Find ONLY faculty

   const user = await User.findOne({

      email,

      role: 'faculty',

   })

   // Compare password

   if (
      user &&
      (await bcrypt.compare(
         password,
         user.password
      ))
   ) {

      res.status(200).json({

         _id: user._id,

         name: user.name,

         email: user.email,

         role: user.role,

         token: generateToken(user._id),

      })

   } else {

      res.status(400).json({

         message: 'Invalid credentials',

      })
   }
}

module.exports = {

   registerStudent,

   registerFaculty,

   loginStudent,

   loginFaculty,

}