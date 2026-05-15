// controllers/opportunityController.js
const mongoose = require('mongoose')
const Opportunity = require('../models/opportunityModel')

// Get opportunities
const getOpportunities = async (req, res) => {

    const search = req.query.search || ''
 
    const opportunities = await Opportunity.find({
      title: { $regex: search, $options: 'i' }
   })
   
   .populate('postedBy', 'name role email')
   
   .populate('applicants', 'name email role')
 
    res.status(200).json(opportunities)
 }

 // Get logged-in user's opportunities
const getMyOpportunities = async (req, res) => {

   const opportunities = await Opportunity.find({
      postedBy: req.user.id,
   })

   .populate('postedBy', 'name role email')

   .populate('applicants', 'name email role')

   res.status(200).json(opportunities)
}




// Create opportunity
const createOpportunity = async (req, res) => {

   const {
      title,
      description,
      category,
      skills
   } = req.body

   // Role-based category restrictions

const facultyCategories = [
   'research',
   'internship',
   'event',
]

const studentCategories = [
   'project',
   'competition',
   'club',
]

if (

   req.user.role === 'student' &&

   facultyCategories.includes(category)

) {

   return res.status(403).json({

      message:
         'Students cannot create this category',

   })
}

if (

   req.user.role === 'faculty' &&

   studentCategories.includes(category)

) {

   return res.status(403).json({

      message:
         'Faculty cannot create this category',

   })
}

   if (!title || !description || !category) {

      res.status(400)

      throw new Error('Please fill all required fields')
   }



   const opportunity = await Opportunity.create({

      title,

      description,

      category,

      skills,

      postedBy: req.user.id,

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
      id: req.params.id
   })
}

// Apply for opportunity
const applyOpportunity = async (req, res) => {

   const opportunity = await Opportunity.findById(
      req.params.id
   )

   if (!opportunity) {

      return res.status(404).json({
         message: 'Opportunity not found',
      })
   }

   // Check if already applied
   const alreadyApplied =
      opportunity.applicants.includes(req.user.id)

   if (alreadyApplied) {

      return res.status(400).json({
         message: 'Already applied',
      })
   }

   opportunity.applicants.push(req.user.id)

   await opportunity.save()

   res.status(200).json(opportunity)
}

// Save / Unsave opportunity
const saveOpportunity = async (req, res) => {

   const opportunity =
      await Opportunity.findById(req.params.id)

   if (!opportunity) {

      return res.status(404).json({
         message: 'Opportunity not found',
      })

   }

   // Check if already saved
   const alreadySaved =
      opportunity.savedBy.includes(req.user.id)

   if (alreadySaved) {

      // Remove save
      opportunity.savedBy =
         opportunity.savedBy.filter(
            (id) =>
               id.toString() !== req.user.id
         )

   } else {

      // Save opportunity
      opportunity.savedBy.push(req.user.id)

   }

   await opportunity.save()

   const updatedOpportunity =
      await Opportunity.findById(
         req.params.id
      )

      .populate(
         'postedBy',
         'name role email'
      )

      .populate(
         'applicants',
         'name email role'
      )

   res.status(200).json(updatedOpportunity)
}



module.exports = {
   getOpportunities,
   getMyOpportunities,
   createOpportunity,
   updateOpportunity,
   deleteOpportunity,
   applyOpportunity,
   saveOpportunity,
}