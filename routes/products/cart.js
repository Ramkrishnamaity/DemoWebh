var express = require('express');
const {isAuthorized, isUser } = require('../../controllers/middlewares/AuthZ');
const {addToCart, removeFromCart} = require('../../controllers/CartController')
var router = express.Router();

router.use(isAuthorized);
router.use(isUser)

// cart related routes
router.post('/addToCart',  addToCart)
router.post('/removeFromCart', removeFromCart)



module.exports = router;