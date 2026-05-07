const express = require('express')
require('dotenv').config()

const app = express()

const { errorHandler } = require('./middleware/errorMiddleware')

app.use(express.json())

const PORT = process.env.PORT || 5000

app.use('/api/auth', require('./routes/authRoutes'))

app.use('/api/opportunities', require('./routes/opportunityRoutes'))

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})