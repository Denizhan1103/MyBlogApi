const mongoose = require("mongoose")

const {createToken} = require("../Helper/Tokenization")
const {hashPassword} = require("../Helper/Hashing")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        unique: true
    },
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 16
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 32
    },
    description: {
        type: String,
        default: ""
    },
    role: {
        type: String,
        default: "User",
        enum: ["User","Moderator","Admin"]
    },
    profileImage: {
        type: String,
        default: ""
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    userToken: {
        type: String,
        default: "null"
    }
},({collection: "Users"}))

userSchema.pre("save",function(next) {
    this.password = hashPassword(this.password)
    this.userToken = createToken(this.name,this.email)
    next()
})

// userSchema.pre("save",(err,next) => {
//     if(err) {
//         next(err)
//     } else {
//         //this.userToken = createToken(this.name,this.password)
//         //this.password = hashPassword(this.password)
//         next(this)
//     }

// })

module.exports = mongoose.model("userSchema",userSchema)