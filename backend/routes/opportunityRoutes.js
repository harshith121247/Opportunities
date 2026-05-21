const express = require('express')

const router = express.Router()

const {
   getOpportunities,
   getMyOpportunities,
   createOpportunity,
   updateOpportunity,
   deleteOpportunity,
   applyOpportunity,
   saveOpportunity,
   approveApplicant,
   rejectApplicant,
} = require('../controllers/opportunityController')

const { protect } =
   require('../middleware/authMiddleware')

   const {
      validateOpportunity,
   } = require('../middleware/validationMiddleware')

// Explore feed
router.get(
   '/',
   protect,
   getOpportunities
)

// Logged-in user's opportunities
router.get(
   '/my',
   protect,
   getMyOpportunities
)

// Create opportunity
router.post(
   '/',
   protect,
   validateOpportunity,
   createOpportunity
)

// Update opportunity
router.put(
   '/:id',
   protect,
   updateOpportunity
)

// Delete opportunity
router.delete(
   '/:id',
   protect,
   deleteOpportunity
)

// Apply for opportunity
router.put(
   '/:id/apply',
   protect,
   applyOpportunity
)

// Save / Unsave opportunity
router.put(
   '/save/:id',
   protect,
   saveOpportunity
)

// Approve applicant & send email
router.post(
   '/:id/approve/:applicantId',
   protect,
   approveApplicant
)

// Reject applicant (removes from list + clears cooldown)
router.post(
   '/:id/reject/:applicantId',
   protect,
   rejectApplicant
)

module.exports = router