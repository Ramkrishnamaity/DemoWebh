const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    user_id:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    name : {
        type: String,
        required: true
    },
    mobileNo : {
        type: Number,
        required: true
    },
    address : {
        type: String,
        required: true
    },
    landmark: {
        type: String,
        required: true
    },
    pincode : {
        type: Number,
        required: true
    },
    addressType : {
        type: String,
        enum: ["Home", "Office"]
    },
    isDelete :{
        type: Boolean,
        default: false
    }
}, { timestamps: true } );

module.exports = mongoose.model("Address", addressSchema);