const multer = require("multer")
const path = require("path")
const { getTokenData } = require("./Tokenization")

const storage = new multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,path.join(__dirname,"../Static/Upload/ProfileImage"))
    },
    filename: (req,file,cb) => {
        let extension = file.mimetype.split("/")[1]
        let userData = getTokenData(req.cookies.userToken)
        req.savedProfileImage = "image_" + userData.email + "." + extension
        cb(null,req.savedProfileImage)
    }
})

const fileFilter = (req,file,cb) => {
    let allowedMimetypes = ["image/jpg","image/png","image/jpeg","image/gif"]
    if(!allowedMimetypes.includes(file.mimetype)) {
        return cb("Mimetypes error",false)
    } else {
        return cb(null,true)
    }
} 

const profileImageUploader = new multer({storage,fileFilter})

module.exports = {
    profileImageUploader
}