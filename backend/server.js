const {
    notFound,
    errorHandler
 } = require('./middleware/errorMiddleware')
const express = require('express')
require('dotenv').config()
require('colors')
const connectDB = require('./config/db')

const app = express()

connectDB()

app.use(express.json())

const PORT = process.env.PORT || 5000

app.use('/api/auth', require('./routes/authRoutes'))

app.use('/api/users', require('./routes/userRoutes'))

app.use('/api/opportunities', require('./routes/opportunityRoutes'))

app.use(notFound)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`.yellow.bold)
})