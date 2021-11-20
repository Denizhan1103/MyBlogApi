const nodeMailer = require("nodemailer")

const userSchema = require("../Model/User")
const {createToken,checkToken,getTokenData} = require("../Helper/Tokenization")
const {hashPassword,compareHash} = require("../Helper/Hashing")

// OK
const login = (req,res,next) => {
    let [email,password] = [req.body.email,req.body.password]
    userSchema.findOne({email:email},(err,data) => {
        if(data !== null) {
            let compareCurrentPassword = compareHash(password,data.password)
            if(compareCurrentPassword == true) {
                if(checkToken(data.userToken) == true) {
                    res.status(200).cookie("userToken",data.userToken,{maxAge:604800}).json({status:200,message:"Your succesfully logged!"})
                } else {
                    let newUserToken = createToken(data.name,data.email)
                    userSchema.findOneAndUpdate({email:data.email},{$set: {userToken:newUserToken}},{new:yes},(err,data) => {
                        if(data !== null) {
                            res.status(200).cookie("userToken",data.userToken,{maxAge:604800}).json({status:200,message:"Your succesfully logged!"})
                        } else {
                            res.status(401).json({status:401,message:"Internal server error"})
                        }
                    })
                    // create new token and return
                }
            } else {
                res.status(300).json({status:300,message:"Password is wrong!"})
            }
        } else {
            res.status(300).json({status:300,message:"User not found!"})
        }
    })
    // let [email,password] = [req.body.email,req.body.password]
    // let hashedPassword = hashPassword(password)
    // userSchema.findOne({email:email},(err,data) => {
    //     if(data !== null) {
    //         console.log(hashedPassword,data.password)
    //         if(hashedPassword == data.password) {
    //             let isTokenVerify = checkToken(data.userToken)
    //             if(isTokenVerify == true) {
    //                 res.status(200).cookie("userToken",data.userToken).json({status:200,message:"Succesfully logged"})
    //             } else {
    //                 let newUserToken = createToken(data.name,data.email)
    //                 userSchema.findOneAndUpdate({email:email},{$set: {userToken:newUserToken}},{new:true},(err,data) => {
    //                     if(data !== null) {
    //                         res.status(200).cookie("userToken",newUserToken).json({status:200,message:"Succesfully logged!"}) 
    //                     } else {
    //                         res.status(301).json({status:301,message:"Internal Server Error"})
    //                     }
    //                 })
    //             }
    //         } else {
    //             res.status(300).json({status:300,message:"Password is wrong!"})
    //         }
    //     } else {
    //         res.status(300).json({status:300,message:"User not found!"})
    //     }
    // })
}

const register = (req,res,next) => {
    let [email,name,password] = [req.body.email,req.body.name,req.body.password]
    const user = new userSchema({email,name,password})
    user.save()
    .then((data) => {
        res.status(200).cookie("userToken",data.userToken,{maxAge:604800}).json({status:200,message:"User successfully created!"})
    })
    .catch((err) => {
        res.json({status:300,message:"User creation failed!",details:err.message})
    })
}

// Camed hashed. Check again
const changePassword = (req,res,next) => {
    let userData = getTokenData(req.cookies.userToken)
    let [currentPassword,newPassword] = [req.body.currentPassword,req.body.newPassword]
    userSchema.findOne({email: userData.email},(err,data) => {
        if(data == null) {
            res.status(400).json({status:400,message:"User not found!"})
        } else {
            if(data.password == currentPassword) {
                // Probably error on this.newPassword
                userSchema.findOneAndUpdate({email:data.email},{$set: {password:newPassword}},{new:true},(err,data) => {
                    if(data == null) {
                        res.status(400).json({status:400,message:"Internal server error!"})
                    } else {      
                        res.status(200).json({status:200,message:"Password succesfully changed!"})
                    }
                })
            } else {
                res.status(400).json({status:400,message:"Current password wrong!"})
            }
        }
    })
}

const changeName = (req,res,next) => {
    let userData = getTokenData(req.cookies.userToken)
    let newName = req.body.newName
    userSchema.findOneAndUpdate({email: userData.email},{$set: {name:newName}},{new:true},(err,data) => {
        if(data == null) {
            res.status(400).json({status:400,message:"User not found!"})
        } else {
            res.status(200).json({status:200,message:"Username successfully changed!"})
        }
    })
    // let [email,newName] = [req.body.email,req.body.newName]
    // userSchema.findOneAndUpdate({email: email},{$set: {name:newName}},{new:true},(err,data) => {
    //     if(data == null) {
    //         res.status(400).json({status:400,message:"User not found!"})
    //     } else {
    //         res.status(200).json({status:200,message:"User name succesfully changed!",details:data})
    //     }
    // })
}

// OK - READ AGAIN UNTİL 10 TIMES
const changeProfileImg = (req,res,next) => {
    let userData = getTokenData(req.cookies.userToken)
    userSchema.findOneAndUpdate({email:userData.email},{$set: {profileImage: req.savedProfileImage}},{new:true},(err,data) => {
        if(data !== null) {
            res.status(200).json({status:200,message:"Profile image succesfully changed!",detail:data})
        } else {
            res.status(401).json({status:401,message:"Internal server error."})
        }
    })
}

// Didn't tested yet
const changeDescription = (req,res,next) => {
    let userData = getTokenData(req.cookies.userToken)
    let newDescription = req.body.newDescription
    userSchema.findOneAndUpdate({email:userData.email},{$set: {description:newDescription}},{new:true},(err,data) => {
        if(data == null) {
            res.status(400).json({status:400,message:"User not found!"})
        } else {
            res.status(200).json({status:200,message:"Description succesfully changed!"})
        }
    })
}

// Didn't tested yet
const logout = (req,res,next) => {
    let userData = getTokenData(req.cookies.userToken)
    userSchema.findOneAndUpdate({email:userData.email},{$set: {userToken: "null"}},{new:true},(err,data) => {
        if(data == null) {
            res.status(400).json({status:400,message:"Internal error!"})
        } else {
            res.status(200).clearCookie("userToken").json({status:200,message:"Succesfully logged out!"})
        }
    })
}

const authorization = (req,res,next) => {
    let userToken = req.cookies.userToken
    userSchema.findOne({userToken: userToken},(err,data) => {
        if(data == null) {
            res.status(300).json({status:300,message:"Your token is not valid!"})
        } else {
            let result = checkToken(data.userToken)
            if(result == true) {
                next()
            } else {
                res.status(300).json({status:300,message:"Your token is outdated"})
            }
        }
    })
}

// OK
const isNotAuth = (req,res,next) => {
    let userData = getTokenData(req.cookies.userToken)
    if(userData !== null) {
        res.status(200).json({status:200,message:"User already logged"})
    } else {
        next()
    }
}

// OK NOT CHECKED
const getUserData = (req,res,next) => {
    let userData = getTokenData(req.cookies.userToken)
    if(userData !== null) {
        userSchema.findOne({email:userData.email},(err,data) => {
            res.status(200)
            .json({message:"OK"})
            .sendFile((__dirname,`../Static/Upload/ProfileImage/${data.profileImage}`))
        //     .json({status:200,message:"User data succesfully returned!",
        //     name:data.name,
        //     email:data.email,
        //     description:data.description,
        //     role:data.role,
        //     profileImage: data.profileImage
        // })
        })
    } else {
        res.status(300).json({status:300,message:"User not found!"})
    }
}

const forgotPassword = async (req,res,next) => {
    let [email,name] = [req.body.email,req.body.name]
    let mailAccount = nodeMailer.createTestAccount()
    let finalMailAccount = nodeMailer.createTransport({
        host: "192.168.0.103",
        port: 5001,
        secure: false, // will look at that
        auth: {
            user: mailAccount.user,
            pass: mailAccount.pass
        },
        tls: {
            rejectUnauthorized: false
        }
    })
    console.log("FINALMAİLACCOUNT GENERATED - OK ")

    let deliverToMail = await finalMailAccount.sendMail({
        from: "Denizhan Onur @dnzonr",
        to: email,
        subject: "About recovery password",
        text: "Hi, if you really want to reset your password please check link of the bottom",
        html: "<p>Hi, if you really want to reset your password please check link of the bottom</p>"
    })

    console.log("DELIVERTOMAİL - OK ")

    .then(delivered => {
        console.log("FINALIZING - OK")
        console.log(delivered.messageId)
        res.status(200).json({status:200,message:delivered.messageId})
    })
    .catch(err => {
        console.log("CATCHING - OK")
        console.error(err)
        res.status(300).json({status:300,message:err})
    })

} 

module.exports = {
    login,
    register,
    changePassword,
    changeName,
    changeProfileImg,
    changeDescription,
    authorization,
    logout,
    isNotAuth,
    forgotPassword,
    getUserData
}