


var express = require('express');
var router = express.Router();
const {isAuthorized, isAdmin} = require('../../controllers/middlewares/AuthZ')
const {addCategory, deleteCategory} = require('../../controllers/CategoryController')
const {addSubCategory, deleteSubCategory} = require('../../controllers/SubCategoryController')
const  {addProduct, addProductImage, deleteProduct} = require('../../controllers/ProductController')

const { body } = require('express-validator');

router.use(isAuthorized);
router.use(isAdmin)

const validator1 = [
    body('category_name').isLength(0).withMessage("Category name is a required field")
]
const validator2 = [
    body('subCategory_name').isLength(0).withMessage("SubCategory name is a required field")
]

const validator3 = [
    body('product_name').isLength(0).withMessage("product_name is a required field"),
    body('product_image').isArray().withMessage("product_name must be a array"),
    body('product_quantity').isEmpty().withMessage("product_quantity is a required field"),
    body('product_costprice').isEmpty().withMessage("product_costprice is a required field"),
    body('product_sellingprice').isEmpty().withMessage("product_sellingprice is a required field")
]

// category related routes
router.post('/category/addCategory', validator1, addCategory)
router.delete('/category/deleteCategory', deleteCategory)

// subCategory related routes
router.post('/subcategory/addSubCategory', validator2, addSubCategory)
router.delete('/subcategory/deleteSubCategory', deleteSubCategory)

// product related routes
router.post('/product/addProduct', validator3, addProduct) 
router.delete('/product/deleteProduct', deleteProduct)

// image upload routes
router.post('/image/addProductImage', addProductImage)


module.exports = router;
