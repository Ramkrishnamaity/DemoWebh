const mongoose = require('mongoose')

const subCategorySchema = new mongoose.Schema({
    category_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    subCategory_name:{
        type: String,
        required: true,
        unique: true
    },
    isDelete: {
        type: Boolean,
        default: false
    }
}, { timestamps: true } );

module.exports = mongoose.model("SubCategory", subCategorySchema);