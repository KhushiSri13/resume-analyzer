const jwt = require("jsonwebtoken");
const blacklistedTokenModel = require("../models/blacklist.model");
async function authUser(req,res,next){
    const token = req.cookies.token;
    if(!token){
        return res.status(401).json({message:"token not provided"})
    }
    const isTokenBlacklisted =await blacklistedTokenModel.findOne({token})
    if(isTokenBlacklisted){
        return res.status(401).json({
            message : "token is invalid"
        })
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
        req.user = decoded;
        next();
    }
    catch(err){
        res.status(401).json({
            message : "Invalid token"
        })
    }
    
    
}
module.exports = {authUser}