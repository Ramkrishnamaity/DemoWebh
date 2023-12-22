const mongoose = require('mongoose')

const cartSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    product_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    quantity :{
        type: Number,
        default: 1
    },
    price: {
        type: Number,
        required: true
    }
}, { timestamps: true } );

module.exports = mongoose.model("Cart", cartSchema);