const Admin = require('../models/Admin')
const User = require('../models/UserModel')

// controller function for profile data

const getProfile = async (req, res) => {
    try {
        //                                                    ------- fix the aggregation
        const { id , type} = req.userData

        let result = type !== 'Admin'? await User.findById(id) : await Admin.findById(id)

      /*  let data = []
        const pipeline = [
            {
                $match: {
                    _id: id,
                    isDelete: false
                }
            },

            {
                $project: {
                    _id: 0,
                    password: 0,
                    token: 0,
                    isDelete: 0,
                    devicetoken: 0,
                    // postalcode: 1,
                    // contact: 1,
                    // email: 1,
             result

        let is = type !== "Admin" ? 
        await User.aggregate(pipeline)
        .then((data1)=>{
            data = data1
        })
        : 
        await Admin.aggregate(pipeline)
        .then((data1)=>{
            data = data1
        })
        */

        

        res.status(200).json({
            success: true,
            message: "profile Fetched",
            data: result
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

        const {id, type} = req.userData
        const { name, email, contact, postalcode } = req.body

        const is = type !== "Admin"? 
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

        
        // if (name) user.name = name;
        // if (email) user.email = email;
        // if (contact) user.contact = contact;
        // if (postalcode) user.postalcode = postalcode;

        // const updatedProfile = await user.save()


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