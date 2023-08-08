const express = require("express")
const Order = require("../models/OrderModel.js")
const User = require("../models/Usermodel.js")


const router = express.Router()

// creating an order
router.post("/", async (req, res) => {
    try {
        const { userId, cart, address, country } = req.body
        const user = await User.findById(userId)
        const order = await Order.create({ owner: userId, products: cart, address, country, total: user.cart.total, count: user.cart.count })
        user.cart = { total: 0, count: 0 }
        user.orders.push(order)
        user.markModified("orders")
        user.markModified("cart")
        await user.save()
        res.status(200).json(user)

    } catch (error) {
        res.status(400).json(error.message)
    }
})


// to get all orders for admin
router.get("/", async (req, res) => {
    try {
        const orders = await Order.find().populate("owner", ["username", "email"])
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

router.patch("/:id/shipped", async (req, res) => {
    try {
        const { id } = req.params
        const { ownerId } = req.body
        const user = await User.findById(ownerId)
        await Order.findByIdAndUpdate(id, { status: "shipped" })
        const orders = await Order.find().populate("owner", ["username", "email"])
        res.status(200).json(orders)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

module.exports = router