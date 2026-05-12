const User = require('../models/userModel')

// Get Profile
const getProfile = async (req, res) => {

   const user = await User.findById(req.user.id)

   if (user) {

      res.status(200).json({
         _id: user._id,
         name: user.name,
         email: user.email,
         role: user.role
      })

   } else {

      res.status(404).json({
         message: 'User not found'
      })
   }
}

// Update Profile
const updateProfile = async (req, res) => {

   const user = await User.findById(req.user.id)

   if (user) {

      user.name = req.body.name || user.name
      user.email = req.body.email || user.email

      const updatedUser = await user.save()

      res.status(200).json({
         _id: updatedUser._id,
         name: updatedUser.name,
         email: updatedUser.email,
         role: updatedUser.role
      })

   } else {

      res.status(404).json({
         message: 'User not found'
      })
   }
}

module.exports = {
   getProfile,
   updateProfile
}