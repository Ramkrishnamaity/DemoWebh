
const jwt = require('jsonwebtoken')
require('dotenv').config()


//  middleware to avoid un authorized access

const isAuthorized = async(req, res, next) => {
    try{

        const token = req.cookies.token
        if(!token){
            return res.status(400).json({
                success: false,
                message: "token does't exists"
            })
        }

        const decodedToken = jwt.verify(token, process.env.SECRETKEY);
        
        req.userData = {
            email: decodedToken.email
        }

        next()

    } catch(error){
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = isAuthorized
