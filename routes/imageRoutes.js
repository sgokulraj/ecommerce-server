const cloudinary = require("cloudinary")
const express = require('express')
const dotenv = require("dotenv")

dotenv.config();

const router = express.Router()

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
})

router.delete('/:public_id', async (req, res) => {
    const { public_id } = req.params
    try {
        await cloudinary.uploader.destroy(public_id)
        res.status(200).send();
    } catch (error) {
        res.status(400).send(error.message)
    }
})

module.exports = router