const express = require("express")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
const path = require("path")
require("dotenv").config({path: path.resolve(__dirname+"/Environment/Environment.env")})

const router = require("./Router")

const app = new express()

const PORT = process.env.PORT || 5000
let tryToDbConnect = -1

let server = app.listen(PORT,(err) => {
    if(err) {
        console.log(new Error("Server couldn't open!"))
    } else {
            console.log(`Server has open on port ${PORT}!`)
            console.log("Connecting to database...")
            connectToDatabase()
    }

})

app.use((req,res,next) => {
    if(tryToDbConnect == -1) {
        next()
    }
})

app.use(express.json())
app.use(cookieParser())
app.use("/",router)

function connectToDatabase() {
    const MONGO_URI = process.env.MONGO_URI
    mongoose.connect(MONGO_URI,(err) => {
        if(err) {
            tryToDbConnect++
            if(tryToDbConnect == 0) {
                console.log(`Couldn't connect to database! (Error code ${err.code})`)
                console.log("Will try to connect every 1 second on the background!")
                setTimeout(() => {
                    connectToDatabase()
                },1000)
            } else if(tryToDbConnect == 10) {
                console.log("Couldn't connect to database on the background!")
                console.log("Server will shutdown until 3 seconds.")
                setTimeout(() => {
                    console.log("Server has shutdown!")
                    server.close()
                },3000)
            } else {
                setTimeout(() => {
                    connectToDatabase()
                },1000)
            }
        } else {
            console.log("Succesfully connect to database!")
        }
    })
}