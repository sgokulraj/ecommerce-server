const express = require("express")
const cors = require("cors")

const dotenv = require("dotenv")
const mongoose = require("mongoose")
const userRoutes = require("./routes/userRoutes.js")
const productRoutes = require("./routes/productRoutes.js")
const imageRoutes = require("./routes/imageRoutes.js")
const orderRoutes = require("./routes/orderRoutes.js")

const app = express()

dotenv.config();
const PORT = process.env.PORT;
const CONNECTION_URL = process.env.CONNECTION_URL;
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY
const stripe = require("stripe")(STRIPE_SECRET_KEY)

app.use(cors());
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use("/users", userRoutes)
app.use("/products", productRoutes)
app.use("/images", imageRoutes)
app.use("/orders", orderRoutes)

app.post("/payment", async (req, res) => {
    try {
        const { amount } = req.body
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: "inr",
            payment_method_types: ['card']
        })
        res.status(200).json(paymentIntent)
    } catch (error) {
        res.status(400).json(error.message);
    }
})


mongoose
    .connect(CONNECTION_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        app.listen(PORT, console.log(`Server is Connected`))
    })
    .catch((err) => console.log(err));