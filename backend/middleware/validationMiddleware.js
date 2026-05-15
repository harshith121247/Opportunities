const {
    body,
    validationResult,
 } = require('express-validator')
 
 // ==========================
 // REGISTER VALIDATION
 // ==========================
 
 const validateRegister = [
 
    body('name')
 
       .trim()
 
       .notEmpty()
 
       .withMessage('Name is required')
 
       .isLength({ min: 3 })
 
       .withMessage(
          'Name must be at least 3 characters'
       ),
 
    body('email')
 
       .isEmail()
 
       .withMessage(
          'Please enter valid email'
       ),
 
    body('password')
 
       .isLength({ min: 6 })
 
       .withMessage(
          'Password must be at least 6 characters'
       ),
 
    (req, res, next) => {
 
       const errors =
          validationResult(req)
 
       if (!errors.isEmpty()) {
 
          return res.status(400).json({
 
             message:
                errors.array()[0].msg,
 
          })
       }
 
       next()
    },
 ]
 
 // ==========================
 // LOGIN VALIDATION
 // ==========================
 
 const validateLogin = [
 
    body('email')
 
       .isEmail()
 
       .withMessage(
          'Valid email required'
       ),
 
    body('password')
 
       .notEmpty()
 
       .withMessage(
          'Password required'
       ),
 
    (req, res, next) => {
 
       const errors =
          validationResult(req)
 
       if (!errors.isEmpty()) {
 
          return res.status(400).json({
 
             message:
                errors.array()[0].msg,
 
          })
       }
 
       next()
    },
 ]
 
 // ==========================
 // OPPORTUNITY VALIDATION
 // ==========================
 
 const validateOpportunity = [
 
    body('title')
 
       .trim()
 
       .notEmpty()
 
       .withMessage('Title required')
 
       .isLength({
          min: 5,
          max: 100,
       })
 
       .withMessage(
          'Title must be 5-100 characters'
       ),
 
    body('description')
 
       .trim()
 
       .notEmpty()
 
       .withMessage(
          'Description required'
       )
 
       .isLength({ min: 10 })
 
       .withMessage(
          'Description must be at least 10 characters'
       ),
 
    body('category')
 
       .isIn([
          'project',
          'internship',
          'hackathon',
          'research',
          'club',
          'event',
          'competition',
          'general',
       ])
 
       .withMessage(
          'Invalid category'
       ),
 
    (req, res, next) => {
 
       const errors =
          validationResult(req)
 
       if (!errors.isEmpty()) {
 
          return res.status(400).json({
 
             message:
                errors.array()[0].msg,
 
          })
       }
 
       next()
    },
 ]
 
 module.exports = {
 
    validateRegister,
 
    validateLogin,
 
    validateOpportunity,
 
 }