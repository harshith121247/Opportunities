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
    },

    // Student profile fields
    branch: {
        type: String,
        trim: true,
        default: ''
    },

    year: {
        type: String,
        enum: ['', '1st Year', '2nd Year', '3rd Year', '4th Year'],
        default: ''
    },

    skills: {
        type: [String],
        default: []
    },

    bio: {
        type: String,
        trim: true,
        default: ''
    },

    // Faculty profile fields
    department: {
        type: String,
        trim: true,
        default: ''
    },

    subjects: {
        type: [String],
        default: []
    },

    // Cooldown: last time student applied to research/internship
    researchInternshipAppliedAt: {
        type: Date,
        default: null
    }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('User',userSchema)
