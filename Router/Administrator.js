const express = require("express")

const {checkAdmin,checkMod} = require("../Controller/Administrator")

const router = new express.Router()

router.post("/checkAdmin",checkAdmin)
router.post("/checkMod",checkMod)

module.exports = router