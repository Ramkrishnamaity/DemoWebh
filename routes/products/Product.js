var express = require('express');
var router = express.Router();
const {isAuthorized} = require('../../controllers/middlewares/AuthZ')
const {getCategories} = require('../../controllers/CategoryController')
const  {getCategoryProducts} = require('../../controllers/ProductController')
const {getSubCategories} = require('../../controllers/SubCategoryController')

router.use(isAuthorized);

// category related routes
router.get('/category/getCategories',  getCategories)

// subCategory related routes
router.get('/category/getSubCategories',  getSubCategories)

// product related routes
router.get('/product/getProducts', getCategoryProducts)


module.exports = router;