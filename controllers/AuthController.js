const User = require('../models/UserModel');
const Admin = require('../models/AdminModel')
const OTP = require('../models/otpModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const { transporter } = require('../config/nodeMailer');
const otpGenerator = require('otp-generator')

// utility function for mail send
const sendMail = async (email, title, body, res) => {
    try {

        let info = await transporter.sendMail({
            from: 'ramkrishna.webhibe@gmail.com',
            to: email,
            subject: title,
            html: `<p>Your otp for registration : ${body} </p>`
        });

        return info

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

// controller function for authentication

const login = async (req, res) => {
    try {

        const { email, password, userType } = req.body;

        // if user does't exist
        let user = userType !== "Admin" ?
            await User.findOne({ email }) :
            await Admin.findOne({ email })

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User does't exists"
            })
        }

        // check the password after decode
        const isSame = await bcrypt.compare(password, user.password);
        if (!isSame) {
            return res.status(400).json({
                success: false,
                message: "Wrong Password"
            })
        }

        // create a secure token(jwt) 
        const jwtToken = jwt.sign(
            { id: user._id, type: user.userType },
            process.env.SECRETKEY
        );

        userType !== "Admin" ?
            await User.findOneAndUpdate(
                { email: email }, { $set: { token: jwtToken } }, { new: true }
            ) :
            await Admin.findOneAndUpdate(
                { email: email }, { $set: { token: jwtToken } }, { new: true }
            );

        res.status(200).json({
            success: true,
            message: "User login succcesfully",
            token: jwtToken
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getOtp = async (req, res) => {
    try {

        const { email } = req.body

        // if user already exist
        let user1 = await User.findOne({ email })
        let user2 = await Admin.findOne({ email })

        if (user1 || user2) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            })
        } else{

        // otp create 
        const otp = otpGenerator.generate(
            6, {
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        }
        );

        // otp save in db
        OTP.create({ email, otp })
            .then(async () => {
                let info = await sendMail(email, "Verification Email", otp, res)

                res.status(200).json({
                    success: true,
                    message: "You receive an otp in your email.",
                    info
                })
            })
    }


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const register = async (req, res) => {
    try {
        const { name, email, password, contact, postalcode, userType, otp } = req.body;

        // match otp and delete
        await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1)
            .then(async(data) => {
                if (data == []) {
                    return res.status(401).json({
                        success: false,
                        message: "OTP expires"
                    })
                }
                if (otp !== data.otp) {
                    return res.status(401).json({
                        success: false,
                        message: "Wrong OTP"
                    })
                }
                await OTP.deleteMany(
                    {email: email}
                )
            })

        // encrypt the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // finally add to DB
        userData = userType !== "Admin" ?
            await User.create(
                { name, email, password: hashedPassword, contact, postalcode, userType, token: null }
            ) :
            await Admin.create(
                { name, email, password: hashedPassword, contact, postalcode, userType, token: null }
            )

        // create a secure token(jwt) 
        const jwtToken = jwt.sign(
            { id: userData._id, type: userType },
            process.env.SECRETKEY
        );

        // save the token
        userType !== "Admin" ?
            await User.findByIdAndUpdate(
                userData._id,
                { $set: { token: jwtToken } }
            ) :
            await Admin.findByIdAndUpdate(
                userData._id,
                { $set: { token: jwtToken } }
            );

        res.status(200).json({
            success: true,
            message: "User register succcesfully",
            token: jwtToken
        })


    } catch (error) {
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { login, register, getOtp }