const Cart = require('../models/AddToCart')

const addToCart = async(req, res) =>{
    try{

        const {product_id} = req.body
        const user_id = req.userData.id

        const isExist = await Cart.findOne(
            {product_id : product_id, user_id: user_id}
        )
        let cart = isExist? (
            await Cart.findByIdAndUpdate(
                    isExist._id,
                    {
                        $set: {quantity: isExist.quantity + 1},
                    },
                    { new: true }
                )
        ) : (
            await Cart.create(
                {
                    product_id,
                    user_id
                }
            )
        );

        // // if any cart doc does't exist then create new cart doc
        // const cart = await Cart.findOneAndUpdate(
        //     {product_id : product_id, user_id: user_id},
        //     {
        //         $set: {quantity: 1},
        //         $setOnInsert: { quantity: 1}
        //     },
        //     { upsert: true }
        // )

        res.status(200).json({
            success: true,
            message: "Product added to the cart.",
            cart
        })

    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}


const removeFromCart = async(req, res) =>{
    try{
        const {cart_id} = req.body
        const user_id = req.userData.id

        // if any cart doc does't exist then create new cart doc
        Cart.findOne({_id: cart_id, user_id: user_id})
        .then(async(cart)=>{

            if(!cart){
                return res.status(401).json({
                    success: false,
                    message: "Cart does't exist."
                })
            }
            let is = cart.quantity > 1? (
                await Cart.findByIdAndUpdate(
                    cart._id,
                    {
                        $set: {
                            quantity: cart.quantity-1
                        }
                    },
                    {new: true}
                )
            ) : (
                await Cart.findByIdAndDelete(cart._id)
            )


            res.status(200).json({
                success: true,
                message: "Product removed from the cart."
            })

        })
        
    } catch(error){
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = {addToCart, removeFromCart}