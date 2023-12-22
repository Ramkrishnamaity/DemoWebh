const Category = require('../models/CategoryModel')
const SubCategory = require('../models/SubCategoryModel')
const Product = require('../models/ProductModel')
const { default: mongoose } = require('mongoose')

const addSubCategory = async(req, res) => {
    try{

        const {category_id, subCategory_name} = req.body

        const isExist = await Category.findById(category_id)
        if(!isExist){
            return res.status(500).json({
                success: false,
                message: "category does't exist"
            })
        }

        const subcategory = await SubCategory.create({category_id, subCategory_name});

        res.status(200).json({
            success: true,
            message: "sub category created",
            data: subcategory
        })
 
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteSubCategory = async(req, res) => {
    try{

        const {subCategory_id} = req.body

        const isExist = await SubCategory.findById(subCategory_id)
        if(!isExist){
            return res.status(500).json({
                success: false,
                message: "category does't exist"
            })
        }

        await SubCategory.updateOne({_id: subCategory_id}, {$set: {isDelete: true}})


        // delete all product belongs to this subcategory 
        // await Product. 


        res.status(200).json({
            success: true,
            message: "subcategory deleted"
        })
 
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getSubCategories = async(req, res) => {
    try{

        // -- pending
        const {category_id} = req.body

        const isExist = await Category.findById(category_id)
        if(!isExist){
            return res.status(500).json({
                success: false,
                message: "category does't exist"
            })
        }

        // ---- whay not work in  aggregation

        // let result = await SubCategory.find(
        //     {category_id: category_id, isDelete: false}
        // )
        // find all categories with isDeleted value false  

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
        ])
        .then((data)=>{
            res.status(200).json({
                success: true,
                message: "category fetched",
                data:data
            })
        })

        
 
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {addSubCategory, deleteSubCategory, getSubCategories}