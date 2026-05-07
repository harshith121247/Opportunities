const express = require('express')

const router = express.Router()

router.get('/register', (req, res) => {
    res.status(200).json({
        message: 'Register User'
    })
})

router.get('/login', (req, res) => {
    res.status(200).json({
        message: 'Login User'
    })
})

module.exports = router