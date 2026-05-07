const asyncHandler = require('express-async-handler')

const Opportunity = require('../models/opportunityModel')


// @desc    Get opportunities
// @route   GET /api/opportunities
// @access  Public
const getOpportunities = asyncHandler(async (req, res) => {

    const opportunities = await Opportunity.find()

    res.status(200).json(opportunities)
})


// @desc    Create opportunity
// @route   POST /api/opportunities
// @access  Private
const createOpportunity = asyncHandler(async (req, res) => {

    const { title, description } = req.body

    if (!title || !description) {

        res.status(400)

        throw new Error('Please add all required fields')
    }

    const opportunity = await Opportunity.create({
        title,
        description
    })

    res.status(201).json(opportunity)
})


// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private
const updateOpportunity = asyncHandler(async (req, res) => {

    const opportunity = await Opportunity.findById(req.params.id)

    if (!opportunity) {

        res.status(404)

        throw new Error('Opportunity not found')
    }

    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true
        }
    )

    res.status(200).json(updatedOpportunity)
})


// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private
const deleteOpportunity = asyncHandler(async (req, res) => {

    const opportunity = await Opportunity.findById(req.params.id)

    if(!opportunity) {
        res.status(404)
        throw new Error('Opportunity not found')

    }
    await opportunity.deleteOne()

    res.status(200).json({
        message: `Delete Opportunity ${req.params.id}`
    })
})

module.exports = {
    getOpportunities,
    createOpportunity,
    updateOpportunity,
    deleteOpportunity
}