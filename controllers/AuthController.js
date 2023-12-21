const User = require('../models/UserModel');
const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// controller function for authentication

const login = async(req, res)=>{
    try{

        const {email, password, userType} = req.body;

        // if user does't exist
        let user = userType !== "Admin"? 
        await User.findOne({email}) :
        await Admin.findOne({email})

        if(!user){
            return res.status(400).json({
                success: false,
                message: "User does't exists"
            })
        }

        // check the password after decode
        const isSame = await bcrypt.compare(password, user.password);
        if(!isSame){
            return res.status(400).json({
                success: false,
                message: "Wrong Password"
            })
        }

        // create a secure token(jwt) 
            const jwtToken = jwt.sign(
            {id: user._id, type: user.userType},
            process.env.SECRETKEY
        );

        const is = userType !== "Admin"? 
        await User.findOneAndUpdate(
            {email: email}, {$set:{token: jwtToken}}, {new: true}
        ) :
        await Admin.findOneAndUpdate(
            {email: email}, {$set:{token: jwtToken}}, {new: true}
        );

        res.status(200).json({
            success: true,
            message: "User login succcesfully",
            token: jwtToken
        })

    } catch(error){
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}


const register = async(req, res) => {
    try{
        const {name, email, password, contact, postalcode, userType} = req.body;

        // if user already exist
        let user = userType !== "Admin"?
        await User.findOne({email}) :
        await Admin.findOne({email}) ;
        

        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // finally add to DB
        userData = userType !== "Admin"?
        await User.create(
            {name, email, password: hashedPassword, contact, postalcode, userType, token: null, isDelete: false}
        ) : 
        await Admin.create(
            {name, email, password: hashedPassword, contact, postalcode, userType, token: null, isDelete: false}
        )

        // create a secure token(jwt) 
        const jwtToken = jwt.sign(
            {id: userData._id, type: userType},
            process.env.SECRETKEY
        );

        // save the token
        const is = userType !== "Admin" ?
        await User.findByIdAndUpdate(
            userData._id,
            {$set:{token: jwtToken}}
        ) :
        await Admin.findByIdAndUpdate(
            userData._id,
            {$set:{token: jwtToken}}
        );

        
        res.status(200).json({
            success: true,
            message: "User register succcesfully",
            token: jwtToken
        })


    } catch(error){
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {login, register}