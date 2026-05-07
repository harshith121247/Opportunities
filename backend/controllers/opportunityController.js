const asyncHandler = require('express-async-handler')

// @desc    Get opportunities
// @route   GET /api/opportunities
// @access  Public
const getOpportunities = asyncHandler(async (req, res) => {

    res.status(200).json({
        message: 'Get Opportunities'
    })
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

    res.status(201).json({
        message: 'Create Opportunity'
    })
})


// @desc    Update opportunity
// @route   PUT /api/opportunities/:id
// @access  Private
const updateOpportunity = asyncHandler(async (req, res) => {

    res.status(200).json({
        message: `Update Opportunity ${req.params.id}`
    })
})


// @desc    Delete opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private
const deleteOpportunity = asyncHandler(async (req, res) => {

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