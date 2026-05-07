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
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Opportunity', opportunitySchema)