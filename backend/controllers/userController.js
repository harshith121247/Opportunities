const mongoose = require('mongoose')
const User = require('../models/userModel')

// Get Profile
const getProfile = async (req, res) => {
   try {
      const user = await User.findById(req.user.id).select('-password')
      if (!user) return res.status(404).json({ message: 'User not found' })

      res.status(200).json({
         _id:        user._id,
         name:       user.name,
         email:      user.email,
         role:       user.role,
         branch:     user.branch     || '',
         year:       user.year       || '',
         skills:     user.skills     || [],
         bio:        user.bio        || '',
         department: user.department || '',
         subjects:   user.subjects   || [],
      })
   } catch (err) {
      res.status(500).json({ message: err.message })
   }
}

// Update Profile  — uses raw MongoDB driver to bypass all Mongoose middleware/validation
const updateProfile = async (req, res) => {
   try {
      // Build the $set payload from request body (only present fields)
      const fields = {}

      if (req.body.name       !== undefined) fields.name       = String(req.body.name).trim()
      if (req.body.bio        !== undefined) fields.bio        = String(req.body.bio)
      if (req.body.branch     !== undefined) fields.branch     = String(req.body.branch)
      if (req.body.year       !== undefined) fields.year       = String(req.body.year)
      if (req.body.department !== undefined) fields.department = String(req.body.department)

      if (Array.isArray(req.body.skills)) {
         fields.skills = req.body.skills.map((s) => String(s).trim()).filter(Boolean)
      }
      if (Array.isArray(req.body.subjects)) {
         fields.subjects = req.body.subjects.map((s) => String(s).trim()).filter(Boolean)
      }

      // Go straight to the native MongoDB driver — identical pattern to db.js migration.
      // This completely bypasses Mongoose strict mode, validators, and markModified.
      const usersCol = mongoose.connection.db.collection('users')
      const _id      = new mongoose.Types.ObjectId(String(req.user.id))

      await usersCol.updateOne({ _id }, { $set: fields })

      // Read back the updated document via Mongoose (safe read-only call)
      const saved = await User.findById(req.user.id).select('-password')
      if (!saved) return res.status(404).json({ message: 'User not found' })

      res.status(200).json({
         _id:        saved._id,
         name:       saved.name,
         email:      saved.email,
         role:       saved.role,
         branch:     saved.branch     || '',
         year:       saved.year       || '',
         skills:     saved.skills     || [],
         bio:        saved.bio        || '',
         department: saved.department || '',
         subjects:   saved.subjects   || [],
      })
   } catch (err) {
      console.error('updateProfile error:', err.message)
      res.status(500).json({ message: err.message })
   }
}

module.exports = { getProfile, updateProfile }
