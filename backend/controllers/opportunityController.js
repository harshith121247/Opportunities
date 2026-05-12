// controllers/opportunityController.js
const mongoose = require('mongoose')
const Opportunity = require('../models/opportunityModel')

// Get opportunities
const getOpportunities = async (req, res) => {

    const search = req.query.search || ''
 
    const opportunities = await Opportunity.find({
       postedBy: req.user.id,
       title: { $regex: search, $options: 'i' }
    }).populate('postedBy', 'name role email')
 
    res.status(200).json(opportunities)
 }

// Create opportunity
const createOpportunity = async (req, res) => {

   const { title, description } = req.body

   if (!title || !description) {
      return res.status(400).json({
         message: 'Please add all fields'
      })
   }

   const opportunity = await Opportunity.create({
      title,
      description,
      postedBy: req.user.id
   })

   res.status(201).json(opportunity)
}

// Update opportunity
const updateOpportunity = async (req, res) => {

    // Validate Mongo ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
       return res.status(400).json({
          message: 'Invalid opportunity ID'
       })
    }
 
    const opportunity = await Opportunity.findById(req.params.id)
 
    if (!opportunity) {
       return res.status(404).json({
          message: 'Opportunity not found'
       })
    }
 
    // Check ownership
    if (opportunity.postedBy.toString() !== req.user.id) {
       return res.status(401).json({
          message: 'Not authorized'
       })
    }
 
    const updatedOpportunity = await Opportunity.findByIdAndUpdate(
       req.params.id,
       req.body,
       { new: true }
    )
 
    res.status(200).json(updatedOpportunity)
 }

// Delete opportunity
const deleteOpportunity = async (req, res) => {

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({
           message: 'Invalid opportunity ID'
        })
    }


   const opportunity = await Opportunity.findById(req.params.id)

   if (!opportunity) {
      return res.status(404).json({
         message: 'Opportunity not found'
      })
   }

   // Check ownership
   if (opportunity.postedBy.toString() !== req.user.id) {
      return res.status(401).json({
         message: 'Not authorized'
      })
   }

   await opportunity.deleteOne()

   res.status(200).json({
      message: 'Opportunity deleted'
   })
}

module.exports = {
   getOpportunities,
   createOpportunity,
   updateOpportunity,
   deleteOpportunity
}