const User = require('../models/UserModel')

// controller function for profile data

const getProfile = async(req, res) => {
    try{
        const {email} = req.userData

        const pipeline = [
            {$match: {email : "$email"}},
            {$project: {_id: 0, name: 1, email: 1, password: 0, postalcode: 1, contact: 1, token: 1, isDelete: 1 }}
        ]

        User.aggregate(pipeline)
        .then
        // Print the aggregated results
        console.log(result)

        res.status(200).json({
            success: true,
            message: "profile Fetched",
            result
        })

    } catch(error){
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}


const updateProfile = async(req, res) => {
    try{

        const userEmail = req.userData.email
        const { name, email, contact, postalcode } = req.body

        // get the user 
        const user = await User.findOne({email: userEmail})

        if(name) user.name = name; 
        if(email) user.email = email; 
        if(contact) user.contact = contact; 
        if(postalcode) user.postalcode = postalcode; 

        const updatedProfile = await user.save()


        res.status(200).json({
            success: true,
            message: "profile updated",
            updatedProfile
        })

    } catch(error){
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {getProfile, updateProfile}