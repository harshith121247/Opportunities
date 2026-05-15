const rateLimit =
   require('express-rate-limit')
const helmet = require('helmet')

const mongoSanitize =
   require('express-mongo-sanitize')

const xss = require('xss-clean')
const {
    notFound,
    errorHandler
 } = require('./middleware/errorMiddleware')
const express = require('express')
require('dotenv').config()
require('colors')
const connectDB = require('./config/db')

const app = express()

// Rate limiter

const limiter = rateLimit({

    windowMs: 15 * 60 * 1000,
 
    max: 100,
 
    message: {
 
       message:
          'Too many requests. Please try again later.',
 
    },
 
 })
// Security middleware

app.use(helmet())

app.use(mongoSanitize())

app.use(xss())

connectDB()

app.use(express.json())

app.use(limiter)

const PORT = process.env.PORT || 5000

app.use('/api/auth', require('./routes/authRoutes'))

app.use('/api/users', require('./routes/userRoutes'))

app.use('/api/opportunities', require('./routes/opportunityRoutes'))

app.use(notFound)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`.yellow.bold)
})