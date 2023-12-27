const { default: mongoose } = require('mongoose')
const Admin = require('../models/AdminModel')
const User = require('../models/UserModel')
const { validationResult } = require('express-validator');

// controller function for profile data

const getProfile = async (req, res) => {
    try {
        const { id , type} = req.userData

        const pipeline = [
            {
                $match: {
                    _id: new mongoose.Types.ObjectId(id),
                    isDelete: false
                }
            },

            {
                $project: {
                    _id: 0,
                    password: 0,
                    token: 0,
                    isDelete: 0,
                    devicetoken: 0
                }
            }]

        let is = type !== "Admin" ? 
        await User.aggregate(pipeline)
        : 
        await Admin.aggregate(pipeline)

        res.status(200).json({
            success: true,
            message: "profile Fetched",
            data: is
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}


const updateProfile = async (req, res) => {
    try {

        // server side validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }
        const {id, type} = req.userData
        const { name, email, contact, postalcode } = req.body

        type !== "Admin"? 
        await User.findByIdAndUpdate(
            id,
            {   
                name: name,
                email: email,
                contact: contact,
                postalcode: postalcode
            }
        ) :
        await Admin.findByIdAndUpdate(
            id,
            {   
                name: name,
                email: email,
                contact: contact,
                postalcode: postalcode
            }
        ) 


        res.status(200).json({
            success: true,
            message: "profile updated"
        })

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { getProfile, updateProfile }