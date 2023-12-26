const Cart = require('../models/AddToCart')
const Product = require('../models/ProductModel')

const addToCart = async (req, res) => {
    try {

        const { product_id } = req.body
        const user_id = req.userData.id

        await Product.findById(product_id)
            .then(async (product) => {
                if (!product) {
                    return res.status(500).json({
                        success: false,
                        message: "Product id invalid"
                    })
                }

                await Cart.findOne(
                    { product_id: product_id, user_id: user_id }
                ).then(async (cart) => {
                    cart ? (
                        await Cart.findByIdAndUpdate(
                            cart._id,
                            {
                                $set: {
                                    quantity: cart.quantity + 1,
                                },
                            },
                            { new: true }
                        )
                    ) : (
                        await Cart.create(
                            {
                                product_id,
                                user_id,
                            }
                        )
                    );
                })

                res.status(200).json({
                    success: true,
                    message: "Product added to the cart."
                })
            })


    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const removeFromCart = async (req, res) => {
    try {
        const { cart_id } = req.body
        const user_id = req.userData.id

        // if any cart doc does't exist then create new cart doc
        await Cart.findOne({ _id: cart_id, user_id: user_id })
            .then(async (cart) => {

                if (!cart) {
                    return res.status(401).json({
                        success: false,
                        message: "Cart does't exist."
                    })
                }
                cart.quantity > 1 ? (
                    await Cart.findByIdAndUpdate(
                        cart._id,
                        {
                            $set: {
                                quantity: cart.quantity - 1
                            }
                        },
                        { new: true }
                    )
                ) : (
                    await Cart.findByIdAndDelete(cart._id)
                )


                res.status(200).json({
                    success: true,
                    message: "Product removed from the cart."
                })

            })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const CheckOut = async (req, res) => {
    try {
        const user_id = req.userData.id

        // fetch all cart doc for that particular user
        await Cart.find(
            { user_id: user_id }
        ).then(async (carts) => {

            if (carts == []) {
                return res.status(401).json({
                    success: false,
                    message: "Add some product to your cart first."
                })
            }

            let totalAmunt = 0;
            for (const cart of carts) {
                await Product.findById(cart.product_id)
                    .then((pro) => {
                        totalAmunt += (pro.product_sellingprice * cart.quantity);
                    })
            }

            //                                    ----why it was not working..??
            // carts.forEach((cart) => {
            //     await Product.findById(cart.product_id)
            //         .then((pro) => {
            //             totalAmunt += (pro.product_sellingprice * cart.quantity);
            //         })
            // })

            res.status(200).json({
                success: true,
                message: "Pay the amount.",
                totalAmunt
            })

        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

module.exports = { addToCart, removeFromCart, CheckOut }