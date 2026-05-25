const express = require('express')
const cors = require('cors')
require('dotenv').config({ path: require('path').join(__dirname, '.env') })
require('colors')

const connectDB = require('./config/db')

const rateLimit = require('express-rate-limit')
const helmet = require('helmet')

const {
   notFound,
   errorHandler,
} = require('./middleware/errorMiddleware')

const app = express()

// FIX #5 — Connect to DB first, before any middleware
connectDB()

// FIX (from previous session) — parse body FIRST before sanitization middleware
app.use(express.json())

app.use(
   cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: false,
   })
)

// Security middleware
app.use(helmet())

const sanitizeInput = (obj) => {
   if (obj && typeof obj === 'object') {
      for (const key of Object.keys(obj)) {
         if (key.startsWith('$') || key.includes('.')) {
            delete obj[key]
         } else {
            sanitizeInput(obj[key])
         }
      }
   }
}

app.use((req, res, next) => {
   sanitizeInput(req.body)
   sanitizeInput(req.params)
   next()
})

const xssClean = (value) => {
   if (typeof value === 'string') {
      return value
         .replace(/</g, '&lt;')
         .replace(/>/g, '&gt;')
         .replace(/"/g, '&quot;')
         .replace(/'/g, '&#x27;')
         .replace(/\//g, '&#x2F;')
   }
   if (value && typeof value === 'object') {
      for (const key of Object.keys(value)) {
         value[key] = xssClean(value[key])
      }
   }
   return value
}

app.use((req, res, next) => {
   if (req.body) xssClean(req.body)
   if (req.params) xssClean(req.params)
   next()
})

// Rate limiter
const limiter = rateLimit({
   windowMs: 15 * 60 * 1000,
   max: 100,
   message: {
      message: 'Too many requests. Please try again later.',
   },
})

app.use(limiter)

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/opportunities', require('./routes/opportunityRoutes'))

// Error middleware
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
   console.log(`Server is running on ${PORT}`.yellow.bold)
})