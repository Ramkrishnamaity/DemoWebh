const Address = require('../models/AddressModel')
const { validationResult } = require('express-validator');

const addAddress = async (req, res) => {
    try {

        // server side validation
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array()
            })
        }

        const user_id = req.userData.id
        const {
            name,
            mobileNo,
            address,
            landmark,
            pincode,
            addressType
        } = req.body

        // add only 3 address of individual user
        await Address.find({ user_id: user_id })
            .then(async (data) => {
                if (data.length === 3) {
                    return res.status(401).json({
                        success: false,
                        message: "You add maximum 3 address."
                    })
                }
                await Address.create(
                    {
                        user_id,
                        name,
                        mobileNo,
                        address,
                        landmark,
                        pincode,
                        addressType
                    }
                ).then(() => {
                    res.status(200).json({
                        success: true,
                        message: "Address added successfully."
                    })
                })

            })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const deleteAddress = async (req, res) => {
    try {

        const user_id = req.userData.id
        const {
            address_id
        } = req.body

        await Address.findOneAndDelete(
            { _id: address_id, user_id: user_id }
        ).then(() => {
            res.status(200).json({
                success: true,
                message: "Address deleted successfully."
            })
        })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const showAddress = async (req, res) => {
    try {
        const user_id = req.userData.id

        await Address.find({ user_id: user_id })
            .then((data) => {
                res.status(200).json({
                    success: true,
                    message: "Address fetched successfully.",
                    data
                })
            })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


module.exports = { addAddress, deleteAddress, showAddress }