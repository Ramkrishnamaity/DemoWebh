var express = require('express');
const {isAuthorized, isUser } = require('../../controllers/middlewares/AuthZ');
const {addToCart, removeFromCart, CheckOut} = require('../../controllers/CartController');
const {addAddress, deleteAddress} = require('../../controllers/Address')
var router = express.Router();

router.use(isAuthorized);
router.use(isUser)

// cart related routes
router.post('/addToCart',  addToCart)
router.post('/removeFromCart', removeFromCart)


// address routes
router.post('/addAddress', addAddress)
router.delete('/deleteAddress', deleteAddress)

// checkout route
router.post('/checkout', CheckOut)




module.exports = router;