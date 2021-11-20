const jwt = require("jsonwebtoken")
const path = require("path")
require("dotenv").config({path: path.resolve(__dirname,"../Environment/Environment.env")})

const createToken = (name,email) => {
    let secretPassword = process.env.JWT_TOKEN
    return jwt.sign({name,email},secretPassword,{algorithm: "HS256",expiresIn:"7d"})
}

const checkToken = (userToken) => {
    let secretPassword = process.env.JWT_TOKEN
    let verify = jwt.verify(userToken,secretPassword,(err,decoded) => {
        if(err) {
            return false
        } else {
            return true
        }
    })
    return verify
}

const getTokenData = (userToken) => {
    let secretPassword = process.env.JWT_TOKEN
    let verify = jwt.verify(userToken,secretPassword,(err,decoded) => {
        if(err) {
            return null
        } else {
            return decoded
        }
    })
    return verify
}

module.exports = {
    createToken,
    checkToken,
    getTokenData
}