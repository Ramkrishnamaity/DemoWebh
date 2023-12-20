var express = require('express');
var router = express.Router();
const {login , register} = require('../controllers/AuthController')


// login and register related routes
router.post('/login', login)
router.post('/register', register)




module.exports = router;