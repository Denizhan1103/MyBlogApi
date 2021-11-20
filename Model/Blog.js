const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title: {
        type:String,
        require: [true,"Please use a valid name"]
    },
    image: {
        type: String,
        require: [true,"Please use a valid image"]
    },
    description: {
        type:String,
        require:[true,"Please use a valid description"],
        minlength: [1000,"Blogpost cannot be smaller than 1000 word."],
        maxlength: [32000,"Blogpost cannot be longer than 32000 word"]
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    writer: {
        type:String,
        require:[true,"Please use a valid writer"]
    },
    organizer: {
        type: String,
        default: ""
    },
    comments: {
        type: Array
    }
})

module.exports = mongoose.model("blogSchema",blogSchema)