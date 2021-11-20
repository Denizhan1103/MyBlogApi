const blogSchema = require("../Model/Blog")
const {getTokenData} = require("../Helper/Tokenization")

createBlog = (req,res,next) => {
    let userData = getTokenData(req.cookies.userToken)
    let [title,description,image] = [req.body.title,req.body.description,req.body.image]
    blogSchema.create({title,description,image,writer:userData.name},(err,data) => {
        if(err) {
            console.log(err)
            res.status(300).json({status:300,message:"Invalid arguments"})
        } else {
            res.status(200).json({status:200,message:"Blog succesfully sended!"})
        }
    })
}

removeBlog = (req,res,next) => {
    let blogTitle = req.body.title
    blogSchema.findOneAndUpdate({title:blogTitle},{$set: {isDeleted:true}},{new:true},(err,data) => {
        if(data !== null) {
            res.status(200).json({status:200,message:"Blog succesfully removed!"})
        } else {
            res.status(300).json({status:300,message:"Blog couldn't found!"})
        }
    })
    
}

editBlog = (req,res,next) => {
    let userData = getTokenData(req.cookies.userToken)
    let currentTitle = req.body.currentTitle
    let [blogTitle,blogDescription,blogImage] = [req.body.blogTitle,req.body.blogDescription,req.body.blogİmage]
    blogSchema.findOneAndUpdate({title:currentTitle},{$set: {title:blogTitle,description:blogDescription,image:blogImage,updatedAt:Date.now(),organizer:userData.name}},{new:true},(err,data) => {
        if(data !== null) {
            res.status(200).json({status:200,message:"Blog succesfully edited!"})
        } else {
            res.status(300).json({status:300,message:"Blog couldn't found"})
        }
    })
}

module.exports = {
    createBlog,
    removeBlog,
    editBlog
}