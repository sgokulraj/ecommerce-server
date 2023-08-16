const mongoose = require("mongoose")
const { Schema, model } = mongoose;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'name is required'],
        minLength: [5, "Require atleast 5 characters"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "email is required"],
        validate: {
            validator: function (mail) {
                return /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/g.test(mail)
            },
            message: (prop) => `${prop.value} is not a valid email`
        }
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    mobile: {
        type: Number,
        required: [true, "Mobile number is required"]
    },
    gender: {
        type: String,
        required: [true, "Gender is required"]
    },
    profilephoto:{
        type: Array,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    cart: {
        type: Object,
        default: {
            total: 0,
            count: 0
        }
    },
    notifications: {
        type: Array,
        default: []
    },
    orders: [{
        type: Schema.Types.ObjectId, ref: "Order"
    }]
}, { minimize: false })

const User = model("User", userSchema)

module.exports = User
