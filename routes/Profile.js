var express = require('express');
var router = express.Router();
const {getProfile , updateProfile} = require('../controllers/ProfileController')
const {isAuthorized} = require('../controllers/middlewares/AuthZ')


const { body } = require('express-validator');

router.use(isAuthorized);

const validator = [
    body('name').isLength(0).withMessage("name is a required field")
    .isLength({min: 6}).withMessage("name must have min length 6")
    .isLength({max: 25}).withMessage("name can have max length 25"),
    body('email').isEmail(),
    body('contact').isNumeric().withMessage("contact should be a number")
    .isLength(10).withMessage("contact should have 10 numbers"),
    body('postalcode').isLength(6).withMessage("pin code should have 6 numbers")
]


// profile related routes
router.get('/getProfile',  getProfile)
router.put('/updateProfile', validator,  updateProfile)


module.exports = router;