const express = require("express")

const {checkAdmin} = require("../Controller/Administrator")
const { authorization } = require("../Controller/Auth")
const {createBlog,removeBlog} = require("../Controller/Blog")

const router = new express.Router()

router.post("/createBlog",authorization,checkAdmin,createBlog)
router.post("/removeBlog",authorization,checkAdmin,removeBlog)
router.post("/editBlog",authorization,checkAdmin,editBlog)
    
module.exports = router