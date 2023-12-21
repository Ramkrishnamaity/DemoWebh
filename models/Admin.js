const mongoose = require('mongoose')

const AdminSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    contact:{
        type: Number,
        required: true
    },
    postalcode: {
        type: Number,
        required: true
    },
    userType: {
        type: String,
        required: true
    },
    devicetoken: {
        type: String,
        default: "default"
    },
    token: {
        type: String
    },
    isDelete: {
        type: Boolean
    }
}, { timestamps: true } );

module.exports = mongoose.model("Admin", AdminSchema);