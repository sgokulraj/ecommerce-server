const mongoose = require("mongoose")
const { Schema, model } = mongoose

const orderSchema = new Schema({
    products: Object,
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        default: "processing"
    },
    total: {
        type: Number,
        default: 0
    },
    count: {
        type: Number,
        default: 0
    },
    date: {
        type: String,
        default: new Date().toISOString().split("T")[0]
    },
    address: String,
    country: String

}, { minimize: false })

const Order = model("Order", orderSchema)
module.exports = Order
