var express = require('express');
var router = express.Router();
const {login , register, getOtp} = require('../controllers/AuthController')

const { body } = require('express-validator');

const validator1 = [
    body('email').isEmail(),
    body('password').isLength({min: 6}).withMessage("Password must have min length 4")
    .isLength({max: 10}).withMessage("password can have max length 10"),
    body('userType').notEmpty()
]
const validator2 = [
    body('name').isLength(0).withMessage("name is a required field")
    .isLength({min: 6}).withMessage("name must have min length 6")
    .isLength({max: 25}).withMessage("name can have max length 25"),
    body('email').isEmail(),
    body('password').isLength({min: 4}).withMessage("Password must have min length 4")
    .isLength({max: 10}).withMessage("password can have max length 10"),
    body('userType').notEmpty(),
    body('contact').isNumeric().withMessage("contact should be a number")
    .isLength(10).withMessage("contact should have 10 numbers"),
    body('postalcode').isLength(6).withMessage("pin code should have 6 numbers"),
    body('otp').isLength(6).withMessage("otp should have 6 numbers")
]
const validator3 = [
    body('email').isEmail()
]

// login and register related routes
router.post('/login', validator1, login)
router.post('/register', validator2, register)
router.post('/getOtp', validator3, getOtp)




module.exports = router;