var express = require('express');
const { isAuthorized, isUser } = require('../../controllers/middlewares/AuthZ');
const { addToCart, removeFromCart, CheckOut } = require('../../controllers/CartController');
const { addAddress, deleteAddress, showAddress } = require('../../controllers/AddressController')
var router = express.Router();

router.use(isAuthorized);
router.use(isUser)

// cart related routes
router.post('/addToCart', addToCart)
router.post('/removeFromCart', removeFromCart)


// address routes
router.post('/addAddress', addAddress)
router.delete('/deleteAddress', deleteAddress)
router.get('/showAddress', showAddress)

// checkout route
router.post('/checkout', CheckOut)


module.exports = router;