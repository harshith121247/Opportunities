const express = require('express')

const router = express.Router()

const {
    getOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity
} = require('../controllers/opportunityController')

router.get('/', getOpportunities)

router.post('/', createOpportunity)

router.put('/:id', updateOpportunity)

router.delete('/:id', deleteOpportunity)

module.exports = router