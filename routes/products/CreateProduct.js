


var express = require('express');
var router = express.Router();
const {isAuthorized, isAdmin} = require('../../controllers/middlewares/AuthZ')
const {addCategory, deleteCategory} = require('../../controllers/CategoryController')
const {addSubCategory, deleteSubCategory} = require('../../controllers/SubCategoryController')
const  {addProduct, deleteProduct} = require('../../controllers/ProductController')

router.use(isAuthorized);
// router.use(isAdmin)

// category related routes
router.post('/category/addCategory', addCategory)
router.delete('/category/deleteCategory', deleteCategory)

// subCategory related routes
router.post('/subcategory/addSubCategory', addSubCategory)
router.delete('/subcategory/deleteSubCategory', deleteSubCategory)

// product related routes
router.post('/product/addProduct', addProduct) 
router.delete('/product/deleteProduct', deleteProduct)


module.exports = router;
