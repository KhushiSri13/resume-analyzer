const mongoose = require("mongoose")

const blacklistedTokenSchema = new mongoose.Schema({
    token : {
        type : String,
        required : [true, "token is required to be blacklisted "]
    }
},{
    timestamps : true
})

const blacklistedTokenModel = mongoose.model("blacklistedToken" ,blacklistedTokenSchema)

module.exports = blacklistedTokenModel