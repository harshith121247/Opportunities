const mongoose = require('mongoose')

const opportunitySchema = mongoose.Schema(
   {
      title: {
         type: String,
         required: [true, 'Please add a title']
      },

      description: {
         type: String,
         required: [true, 'Please add a description']
      },

      category: {
        type: String,
        enum: [
           'project',
           'internship',
           'hackathon',
           'research',
           'club',
           'event',
           'competition',
           'general'
        ],
        required: true
     },

      skills: {
         type: [String],
         default: []
      },

      postedBy: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'User',
         required: true
      }
   },
   {
      timestamps: true
   }
)

module.exports = mongoose.model('Opportunity', opportunitySchema)