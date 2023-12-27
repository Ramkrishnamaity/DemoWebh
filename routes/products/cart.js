var express = require('express');
const { isAuthorized, isUser } = require('../../controllers/middlewares/AuthZ');
const { addToCart, removeFromCart, CheckOut } = require('../../controllers/CartController');
const { addAddress, deleteAddress, showAddress } = require('../../controllers/AddressController')
var router = express.Router();

const { body } = require('express-validator');

router.use(isAuthorized);
router.use(isUser)


const validator1 = [
    body('name').isLength(0).withMessage("name is a required field")
    .isLength({min: 6}).withMessage("name must have min length 6")
    .isLength({max: 25}).withMessage("name can have max length 25"),
    body('address').isLength(0).withMessage("address is a required field"),
    body('landmark').isLength(0).withMessage("landmark is a required field"),
    body('mobileNo').isNumeric().withMessage("mobileNo should be a number")
    .isLength(10).withMessage("mobileNo should have 10 numbers"),
    body('postalcode').isLength(6).withMessage("pin code should have 6 numbers"),
    body('addressType').isLength(0).withMessage("addressType is a required field"),
]


// cart related routes
router.post('/addToCart', addToCart)
router.post('/removeFromCart', removeFromCart)


// address routes
router.post('/addAddress', validator1, addAddress)
router.delete('/deleteAddress', deleteAddress)
router.get('/showAddress', showAddress)

// checkout route
router.post('/checkout', CheckOut)


module.exports = router;