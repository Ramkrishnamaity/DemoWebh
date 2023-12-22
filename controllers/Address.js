const Address = require('../models/AddressModel')

const addAddress = async(req, res)=> {
    try{

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
        const addresses = await Address.find({user_id: user_id})
        if(addresses >= 3){
            return res.status(401).json({
                success: false,
                message: "You only add maximum 3 address."
            })
        }

        const output = await Address.create(
            {   user_id,
                name,
                mobileNo,
                address,
                landmark,
                pincode,
                addressType
            }
        )

        res.status(200).json({
            success: true,
            message: "Address added successfully.",
            output
        })

    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const deleteAddress = async(req, res)=> {
    try{

        const user_id = req.userData.id
        const {
            address_id
        } = req.body
        
        Address.findOneAndDelete(
            {_id: address_id, user_id: user_id}
        ).then(()=>{
            res.status(200).json({
                success: true,
                message: "Address deleted successfully."
            })
        })


    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {addAddress, deleteAddress}