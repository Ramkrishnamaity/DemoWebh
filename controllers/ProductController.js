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


        // category check
        const category = await Category.findOne(
            { _id: category_id, isDelete: false }
        )

        if (!category) {
            return res.status(500).json({
                success: false,
                message: "category does't exist"
            })
        }
        // subcategory check
        const subcategory = await SubCategory.aggregate([
            {
                $match: {
                    category_id: category_id,
                    isDelete: false
                }
            }
        ])
        if (!subcategory) {
            return res.status(500).json({
                success: false,
                message: "subcategory does't exist"
            })
        }



        await Product.create(
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
            message: "Product created"
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

        const product = await Product.findById(product_id)
        // if product does't exist
        if (!product) {
            return res.status(500).json({
                success: false,
                message: "Product does't exist"
            })
        }

        await Product.findByIdAndUpdate(product_id,
            {
                isDelete: true
            }
        )

        res.status(200).json({
            success: true,
            message: "Product deleted"
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

        const category = await Category.findOne(
            { _id: category_id, isDelete: false }
        )
        
        if (!category) {
            return res.status(500).json({
                success: false,
                message: "category does't exist"
            })
        }
        const subcategory = await SubCategory.findOne(
            { _id: subCategory_id, isDelete: false }
        )
        if (!subcategory) {
            return res.status(500).json({
                success: false,
                message: "subcategory does't exist"
            })
        }

        let result = await Product.find(
            {
                category_id: category_id,
                subCategory_id: subCategory_id
            }
        )
        // await Product.aggregate([
        //     {
        //         $match: {
        //             category_id: category_id,
        //             subCategory_id: subCategory_id,
        //             isDelete: false
        //         },
        //     },
        //     {
        //         $project: {
        //             _id: 0,
        //             isDelete: 0
        //         }
        //     }
        // ])
        // .then((data)=>{
        //     result = data
        // })

        res.status(200).json({
            success: true,
            message: "category created",
            result
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const addProductImage = async(req, res) => {
    try{

        const image = req.files.product_image

        const folder = process.env.IMAGE_FOLDER
        const imageData = await cloudinary.uploader.upload(image.tempFilePath, {folder});

        res.status(200).json({
            success: true,
            message: "Product Image uploadded",
            url: imageData.secure_url
        })

    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = { addProduct, deleteProduct, getCategoryProducts , addProductImage}