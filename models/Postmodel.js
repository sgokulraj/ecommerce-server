const mongoose = require("mongoose")
const {Schema, model} = mongoose

const productSchema = new Schema({
    productName:{
        type: String,
        required: [true, "Product name required"]
    }, 
    description:{
        type: String,
        required:[true, "Product description required"]
    }, 
    price:{
        type: String,
        required:[true, "Price required"]
    },
    category:{
        type: String,
        required:[true, "Product category required"]
    },
    pictures:{
        type: Array,
        required: true
    }
},{minimize:false})


const Product = model("Product", productSchema)
module.exports= Product