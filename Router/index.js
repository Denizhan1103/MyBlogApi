const express = require("express")
const path = require("path")

const auth = require("./Auth")
const administrator = require("./Administrator")
const blog = require("./Blog")

const router = new express.Router()

router.get("/",(req,res) => {
    res.sendFile(path.resolve(__dirname,"../Static/index.html"))
})

router.use("/auth",auth)
router.use("/administrator",administrator)
router.use("/blog",blog)

module.exports = router
