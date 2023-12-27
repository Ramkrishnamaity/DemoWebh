const Category = require('../models/CategoryModel')
const SubCategory = require('../models/SubCategoryModel')
const Product = require('../models/ProductModel')
const { default: mongoose } = require('mongoose')
const { validationResult } = require('express-validator');

const addSubCategory = async (req, res) => {
    try {
        // server side validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        const { category_id, subCategory_name } = req.body

        await Category.findOne({ _id: category_id, isDelete: false })
            .then(async (data) => {
                if (!data) {
                    return res.status(500).json({
                        success: false,
                        message: "category does't exist"
                    })
                }
                const subcategory = await SubCategory.create({ category_id, subCategory_name });

                res.status(200).json({
                    success: true,
                    message: "sub category created",
                    data: subcategory
                })
            })



    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteSubCategory = async (req, res) => {
    try {

        const { subCategory_id } = req.body

        await SubCategory.findByIdAndUpdate(
            { _id: subCategory_id }, { $set: { isDelete: true } }
        ).then(async (data) => {
            if (!data) {
                return res.status(500).json({
                    success: false,
                    message: "subcategory does't exist"
                })
            }

            // delete all product belongs to this subcategory 
            await Product.updateMany(
                {subCategory_id: subCategory_id, isDelete: false},
                {
                    isDelete: true
                }
            )

            res.status(200).json({
                success: true,
                message: "subcategory deleted"
            })
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getSubCategories = async (req, res) => {
    try {

        const { category_id } = req.body

        await SubCategory.aggregate([
            {
                $match: {
                    category_id: new mongoose.Types.ObjectId(category_id),
                    isDelete: false
                }
            },

            {
                $project: {
                    _id: 0,
                    isDelete: 0
                }
            }
        ]).then((data) => {
            res.status(200).json({
                success: true,
                message: "subcategory fetched",
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


module.exports = { addSubCategory, deleteSubCategory, getSubCategories }