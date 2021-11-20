const userSchema = require("../Model/User")

const {getTokenData} = require("../Helper/Tokenization")

checkAdmin = (req,res,next) => {
    let userToken = req.cookies.userToken
    let userData = getTokenData(userToken)
    if(userData !== null) {
        let userMail = userData.email
        // userData.name, userData.email
        userSchema.findOne({email:userMail},(err,data) => {
            if(data == null) {
                res.status(300).json({status:300,message:"User not found"})
            } else {
                if(data.role == "Admin") {
                    next()
                } else {
                    res.status(300).json({status:300,message:"You have not permission!"})
                }
            }
        })
    } else {
        res.status(300).json({status:300,message:"Usertoken is not valid!"})
    }
}

checkMod = (req,res,next) => {

}

module.exports = {
    checkAdmin,
    checkMod
}