var express = require('express');
var router = express.Router();
const {getProfile , updateProfile} = require('../controllers/ProfileController')
const isAuthorized = require('../controllers/middlewares/AuthZ')

// profile related routes
router.get('/getProfile', isAuthorized, getProfile)
router.put('/updateProfile', isAuthorized, updateProfile)


module.exports = router;