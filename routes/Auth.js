var express = require('express');
var router = express.Router();
const {login , register, getOtp} = require('../controllers/AuthController')


// login and register related routes
router.post('/login', login)
router.post('/register', register)
router.post('/getOtp', getOtp)




module.exports = router;