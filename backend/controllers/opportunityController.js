// controllers/opportunityController.js
const mongoose = require('mongoose')
const Opportunity = require('../models/opportunityModel')
const User = require('../models/userModel')
const { sendApprovalMail, sendApplicationMail } = require('../config/mailer')

// Get opportunities
const getOpportunities = async (req, res) => {

    const search = req.query.search || ''
 
    const opportunities = await Opportunity.find({
      title: { $regex: search, $options: 'i' }
   })
   .sort({ createdAt: -1 })
   .populate('postedBy', 'name role email')
   .populate({ path: 'applicants.user', select: 'name email role branch year skills department subjects bio' })

    res.status(200).json(opportunities)
 }

 // Get logged-in user's opportunities
const getMyOpportunities = async (req, res) => {

   const opportunities = await Opportunity.find({
      postedBy: req.user.id,
   })
   .sort({ createdAt: -1 })
   .populate('postedBy', 'name role email')
   .populate({ path: 'applicants.user', select: 'name email role branch year skills department subjects bio' })

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



   const created = await Opportunity.create({
      title,
      description,
      category,
      skills,
      postedBy: req.user.id,
   })

   const opportunity = await Opportunity.findById(created._id)
      .populate('postedBy', 'name role email')
      .populate({ path: 'applicants.user', select: 'name email role branch year skills department subjects bio' })

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
 
    await Opportunity.findByIdAndUpdate(req.params.id, req.body)

    const updatedOpportunity = await Opportunity.findById(req.params.id)
       .populate('postedBy', 'name role email')
       .populate({ path: 'applicants.user', select: 'name email role branch year skills department subjects bio' })

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

   const opportunity = await Opportunity.findById(req.params.id)

   if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' })
   }

   // Check if already applied
   if (opportunity.applicants.some((a) => a.user.toString() === req.user.id)) {
      return res.status(400).json({ message: 'Already applied' })
   }

   // Cooldown check: students applying to research/internship
   const COOLDOWN_CATEGORIES = ['research', 'internship']
   const COOLDOWN_MS = 24 * 60 * 60 * 1000 // 1 day

   if (req.user.role === 'student' && COOLDOWN_CATEGORIES.includes(opportunity.category)) {
      const student = await User.findById(req.user.id)

      if (student.researchInternshipAppliedAt) {
         const elapsed = Date.now() - new Date(student.researchInternshipAppliedAt).getTime()

         if (elapsed < COOLDOWN_MS) {
            const remainingMs = COOLDOWN_MS - elapsed
            const hours   = Math.floor(remainingMs / (1000 * 60 * 60))
            const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60))

            return res.status(429).json({
               message: `You already have a pending research/internship application. Please wait ${hours}h ${minutes}m before applying to another.`,
               cooldown: true,
               remainingMs,
            })
         }
      }

      // Set cooldown timestamp
      await User.findByIdAndUpdate(req.user.id, {
         researchInternshipAppliedAt: new Date(),
      })
   }

   opportunity.applicants.push({ user: req.user.id, status: 'pending', appliedAt: new Date() })
   await opportunity.save()

   // Send application notification email to the opportunity creator (non-blocking)
   const creator = await User.findById(opportunity.postedBy).select('name email')
   if (creator) {
      const applicantUser = await User.findById(req.user.id).select('name email')
      sendApplicationMail({
         toEmail: creator.email,
         toName: creator.name,
         applicantName: applicantUser?.name || 'A student',
         applicantEmail: applicantUser?.email || '',
         opportunityTitle: opportunity.title,
      }).catch((err) => console.error('Application mail error:', err.message))
   }

   const populated = await Opportunity.findById(opportunity._id)
      .populate('postedBy', 'name role email')
      .populate({ path: 'applicants.user', select: 'name email role branch year skills department subjects bio' })

   res.status(200).json(populated)
}

// Reject applicant (removes from list + clears their cooldown for research/internship)
const rejectApplicant = async (req, res) => {
   const { id, applicantId } = req.params

   if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(applicantId)) {
      return res.status(400).json({ message: 'Invalid ID' })
   }

   const opportunity = await Opportunity.findById(id)

   if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' })
   }

   if (opportunity.postedBy.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' })
   }

   // Set applicant status to rejected
   const entry = opportunity.applicants.find((a) => a.user.toString() === applicantId)
   if (!entry) {
      return res.status(404).json({ message: 'Applicant not found in this opportunity' })
   }
   entry.status = 'rejected'
   await opportunity.save()

   // Clear the student's cooldown if this was a research/internship
   const COOLDOWN_CATEGORIES = ['research', 'internship']
   if (COOLDOWN_CATEGORIES.includes(opportunity.category)) {
      await User.findByIdAndUpdate(applicantId, { researchInternshipAppliedAt: null })
   }

   const populated = await Opportunity.findById(opportunity._id)
      .populate('postedBy', 'name role email')
      .populate({ path: 'applicants.user', select: 'name email role branch year skills department subjects bio' })

   res.status(200).json(populated)
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

      .populate('postedBy', 'name role email')
      .populate({ path: 'applicants.user', select: 'name email role branch year skills department subjects bio' })

   res.status(200).json(updatedOpportunity)
}



// Approve applicant and send email
const approveApplicant = async (req, res) => {

   const { id, applicantId } = req.params

   if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(applicantId)) {
      return res.status(400).json({ message: 'Invalid ID' })
   }

   const opportunity = await Opportunity.findById(id).populate('postedBy', 'name email')

   if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' })
   }

   if (opportunity.postedBy._id.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' })
   }

   // Set applicant status to accepted
   const entry = opportunity.applicants.find((a) => a.user.toString() === applicantId)
   if (!entry) {
      return res.status(404).json({ message: 'Applicant not found in this opportunity' })
   }
   entry.status = 'accepted'
   await opportunity.save()

   // Send approval email (non-blocking — don't fail the request if mail fails)
   const applicant = await User.findById(applicantId).select('name email')
   if (applicant) {
      sendApprovalMail({
         toEmail: applicant.email,
         toName: applicant.name,
         opportunityTitle: opportunity.title,
         postedByName: opportunity.postedBy.name,
      }).catch((err) => console.error('Mail error:', err.message))
   }

   const populated = await Opportunity.findById(opportunity._id)
      .populate('postedBy', 'name role email')
      .populate({ path: 'applicants.user', select: 'name email role branch year skills department subjects bio' })

   res.status(200).json(populated)
}

module.exports = {
   getOpportunities,
   getMyOpportunities,
   createOpportunity,
   updateOpportunity,
   deleteOpportunity,
   applyOpportunity,
   saveOpportunity,
   approveApplicant,
   rejectApplicant,
}