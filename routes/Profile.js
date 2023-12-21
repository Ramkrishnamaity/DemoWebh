var express = require('express');
var router = express.Router();
const {getProfile , updateProfile} = require('../controllers/ProfileController')
const {isAuthorized} = require('../controllers/middlewares/AuthZ')

router.use(isAuthorized);
// profile related routes
router.get('/getProfile',  getProfile)
router.put('/updateProfile',  updateProfile)


module.exports = router;