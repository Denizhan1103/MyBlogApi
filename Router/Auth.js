const express = require("express")

const {getUserData,forgotPassword,isNotAuth,login,register,changePassword,changeName,changeProfileImg,changeDescription,logout, authorization} = require("../Controller/Auth")
const {profileImageUploader} = require("../Helper/ImageUploder")

const router = new express.Router()

router.post("/login",isNotAuth,login)
router.post("/register",register)
router.post("/changePassword",authorization,changePassword)
router.post("/changeName",authorization,changeName)
router.post("/changeProfileImage",authorization,profileImageUploader.single("profile_image"),changeProfileImg)
router.post("/changeDescription",authorization,changeDescription)
router.post("/logout",authorization,logout)
router.post("/forgotPw",isNotAuth,forgotPassword)
router.post("/getUserData",authorization,getUserData)

module.exports = router