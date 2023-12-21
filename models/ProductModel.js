const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    subCategory_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    product_name :{
        type: String,
        required: true,
        unique: true
    },
    product_costprice :{
        type: Number,
        required: true
    },
    product_sellingprice :{
        type: Number,
        required: true
    },
    product_quantity :{
        type: Number,
        required: true
    },
    product_image :[
        {
            type: String,
            required: true
        }
    ],
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true } );

module.exports = mongoose.model("Product", productSchema);