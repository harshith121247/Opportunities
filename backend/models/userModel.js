const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type:String,
        required: true, 
        trim : true
    },

    email: {
        type:String,
        required:true, 
        unique:true,
        lowercase : true,
        match: [
            /^[a-z0-9.]+@(cb\.students\.amrita\.edu|cb\.amrita\.edu)$/,
            'Please use a valid Amrita email'
        ]
    },

    password: {
        type:String,
        required:true,
        minlength:6
    },

    role: {
        type: String,
        enum: ['student', 'faculty'],
        default: 'student'
      }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User',userSchema)
