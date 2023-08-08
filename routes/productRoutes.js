const express = require("express")
const Product = require("../models/Postmodel.js")
const User = require("../models/Usermodel.js")

const router = express.Router()


//To create Product
router.post("/", async (req, res) => {
    try {
        const { productName, description, price, category, images: pictures } = req.body
        const product = await Product.create({ productName, description, price, category, pictures })
        const products = await Product.find()
        res.status(201).json(products)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//To get all products
router.get("/", async (req, res) => {
    try {
        const products = await Product.find()
        res.status(200).json(products)
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//To get single Product
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findById(id)
        const similarProduct = await Product.find({ category: product.category }).limit(5)
        res.status(200).json({ product, similarProduct })
    } catch (e) {
        res.status(400).send(e.message)
    }
})

//To update the Product
router.patch("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { productName, description, price, category, images: pictures } = req.body
        const product = await Product.findByIdAndUpdate(id, { productName, description, price, category, pictures })
        const products = await Product.find()
        res.status(200).json(products)
    } catch (error) {
        res.status(400).send(e.message)
    }
})

//To delete the Product
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body
        const user = await User.findById(userId)
        if (!user.isAdmin) {
            res.status(401).json("You aren't permitted")
        } else {
            await Product.findByIdAndDelete(id);
            const products = await Product.find()
            res.status(200).json(products)
        }
    } catch (error) {
        res.status(400).send(e.message)
    }
})


//To get Products based on category
router.get("/category/:category", async (req, res) => {
    try {
        const { category } = req.params
        let products;
        if (category == 'all') {
            products = await Product.find().sort({ "_id": -1 })
        } else {
            products = await Product.find({ category }).sort({ "_id": -1 })
        }
        res.status(200).json(products)
    } catch (error) {
        res.status(400).send(e.message)
    }
})

router.post('/addToCart', async (req, res) => {
    try {
        const { userId, productId, price } = req.body
        const user = await User.findById(userId);
        const cart = user.cart;
        if (productId in user.cart) {
            cart[productId] += 1
        } else {
            cart[productId] = 1
        }
        cart.count += 1;
        cart.total = Number(cart.total) + Number(price)
        user.cart = cart
        user.markModified('cart');
        await user.save()
        res.status(200).json(user)

    } catch (error) {
        res.status(400).send(e.message)
    }
})

router.post('/increaseCart', async (req, res) => {
    try {
        const { userId, productId, price } = req.body
        const user = await User.findById(userId);
        const cart = user.cart;
        cart.total += Number(price)
        cart.count += 1;
        cart[productId] += 1
        user.cart = cart
        user.markModified('cart');
        await user.save()
        res.status(200).json(user)

    } catch (error) {
        res.status(400).send(e.message)
    }
})

router.post('/decreaseCart', async (req, res) => {
    try {
        const { userId, productId, price } = req.body
        const user = await User.findById(userId);
        const cart = user.cart;
        cart.total -= Number(price)
        cart.count -= 1;
        cart[productId] -= 1
        user.cart = cart
        user.markModified('cart');
        await user.save()
        res.status(200).json(user)

    } catch (error) {
        res.status(400).send(e.message)
    }
})

router.post('/removeFromCart', async (req, res) => {
    try {
        const { userId, productId, price } = req.body
        const user = await User.findById(userId);
        const cart = user.cart;
        cart.total -= Number(cart[productId]) * Number(price);
        cart.count -= cart[productId];
        delete cart[productId];
        user.cart = cart
        user.markModified('cart');
        await user.save()
        res.status(200).json(user)

    } catch (error) {
        res.status(400).send(e.message)
    }
})


module.exports = router