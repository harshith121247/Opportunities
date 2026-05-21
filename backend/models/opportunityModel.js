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
      },
      applicants: [
         {
            _id:       false,
            user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            status:    { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
            appliedAt: { type: Date, default: Date.now },
         },
      ],

      savedBy: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
         },
      ],
      
   },
   {
      timestamps: true
   }
)

module.exports = mongoose.model('Opportunity', opportunitySchema)