
const jwt = require('jsonwebtoken')
require('dotenv').config()


//  middleware to avoid un authorized access

const isAuthorized = async(req, res, next) => {
    try{

        const token = req.headers.authorization
        if(!token){
            return res.status(400).json({
                success: false,
                message: "token does't exists"
            })
        }

        const decodedToken = jwt.verify(token, process.env.SECRETKEY);
        
        req.userData = {
            id: decodedToken.id,
            type: decodedToken.type
        }

        next()

    } catch(error){
        res.status(404).json({
            success: false,
            message: error.message
        })
    }
}

const isAdmin = async(req, res, next) => {
    try{

        const {type} = req.userData

        if(type !== "Admin"){
            return res.status(401).json({
                success: false,
                message: "protected route for Admin."
            })
        }

        next()

    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}




module.exports = {isAuthorized, isAdmin}
