const { default: mongoose } = require('mongoose')
const Category = require('../models/CategoryModel')
const Product = require('../models/ProductModel')
const SubCategory = require('../models/SubCategoryModel')
const cloudinary = require('cloudinary').v2
require('dotenv').config()

const addProduct = async (req, res) => {
    try {

        const {
            category_id,
            subCategory_id,
            product_name,
            product_costprice,
            product_sellingprice,
            product_quantity,
            product_image
        } = req.body


        // subcategory check ( and category )
        await SubCategory.findOne(
            { _id: subCategory_id, category_id: category_id ,  isDelete: false}
        ).then(async (data) => {
            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid category, subCategory"
                })
            }

            const product = await Product.create(
                {
                    category_id,
                    subCategory_id,
                    product_name,
                    product_costprice,
                    product_sellingprice,
                    product_quantity,
                    product_image
                }
            );

            res.status(200).json({
                success: true,
                message: "Product created",
                product
            })

        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {

        const { product_id } = req.body
        
        await Product.findOneAndUpdate(
            {_id: product_id, isDelete: false },
            {
                isDelete: true
            }
        ).then((data)=>{
            if (!data) {
                return res.status(401).json({
                    success: false,
                    message: "Product does't exist"
                })
            }

            res.status(200).json({
                success: true,
                message: "Product deleted"
            })
        })
   

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getCategoryProducts = async (req, res) => {
    try {

        const { category_id, subCategory_id } = req.body

        await Product.aggregate([
            {
                $match: {
                    category_id: new mongoose.Types.ObjectId(category_id),
                    subCategory_id: new mongoose.Types.ObjectId(subCategory_id),
                    isDelete: false
                },
            },
            {
                $project: {
                    _id: 0,
                    isDelete: 0
                }
            }
        ])
        .then((data)=>{
            res.status(200).json({
                success: true,
                message: "Products fetched",
                data: data
            })
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const addProductImage = async (req, res) => {
    try {

        const image = req.files.product_image

        const folder = process.env.IMAGE_FOLDER
        const imageData = await cloudinary.uploader.upload(image.tempFilePath, { folder });

        res.status(200).json({
            success: true,
            message: "Product Image uploadded",
            url: imageData.secure_url
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = { addProduct, deleteProduct, getCategoryProducts, addProductImage }