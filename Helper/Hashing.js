const bcrypt = require("bcrypt")

let hashPassword = (password) => {
    let genSalt = bcrypt.genSaltSync(10)
    return bcrypt.hashSync(password,genSalt)
}

let compareHash = (currentPassword,hashedPassword) => {
    return bcrypt.compareSync(currentPassword,hashedPassword,(err,result) => {
        if(err) {
            return false
        } else {
            return true
        }
    })
}

module.exports = {
    hashPassword,
    compareHash
}