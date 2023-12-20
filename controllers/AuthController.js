const User = require('../models/UserModel');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

// controller function for authentication

const login = async(req, res)=>{
    try{

        const {email, password} = req.body;

        // if user does't exist
        const user = await User.findOne({email})
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
            {name: user.name, email: user.email},
            process.env.SECRETKEY,
            { expiresIn: '1h'}
        );

        const updatedUser = await User.findOneAndUpdate(
            {email: email}, {$set:{token: jwtToken}}, {new: true}
        );

        res.status(200).json({
            success: true,
            message: "User login succcesfully",
            updatedUser
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

        const {name, email, password, contact, postalcode} = req.body;

        // if user already exist
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        }

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create a secure token(jwt) 
        const jwtToken = jwt.sign(
            {name: name, email: email},
            process.env.SECRETKEY,
            { expiresIn: '1h'}
        );

        // finally add to DB
        const userData = await User.create(
            {name, email, password: hashedPassword, contact, postalcode, token: jwtToken, isDelete: false}
        )


        res.status(200).cookie('token',jwtToken, {httpOnly: true}).json({
            success: true,
            message: "User register succcesfully",
            userData
        })


    } catch(error){
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {login, register}