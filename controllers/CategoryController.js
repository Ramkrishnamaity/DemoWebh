const Category = require('../models/CategoryModel');
const Product = require('../models/ProductModel');
const SubCategory = require('../models/SubCategoryModel');

const addCategory = async(req, res) => {
    try{

        const {category_name} = req.body

        const category = await Category.create({category_name});

        res.status(200).json({
            success: true,
            message: "category created",
            data: category
        })
 
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteCategory = async(req, res) => {
    try{

        const {category_id} = req.body

        await Category.findOneAndUpdate(
        {_id: category_id, isDelete: false}, {$set: {isDelete: true}})
        .then(async (data)=>{
            if(!data){
                return res.status(500).json({
                    success: false,
                    message: "category does't exist"
                })
            }

            // delete all subcategories and product belongs to this category 

            await SubCategory.updateMany(
                {category_id: category_id, isDelete: false},
                {
                    isDelete: true
                }
            )
            
            await Product.updateMany(
                {category_id: category_id, isDelete: false},
                {
                    isDelete: true
                }
            )


            res.status(200).json({
                success: true,
                message: "category deleted"
            })

        })

    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getCategories = async(req, res) => {
    try{

        let result = []
        // find all categories with isDeleted value false  
        await Category.aggregate([
            {
                $match: {
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
            result = data
        })

        res.status(200).json({
            success: true,
            message: "category created",
            result
        })
 
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = {addCategory, deleteCategory, getCategories}