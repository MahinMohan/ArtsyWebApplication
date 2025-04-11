// import jwt from "jsonwebtoken";
const jwt = require("jsonwebtoken")
JWT_SECRET = "A256ygh#1223luos";
const User = require("./database/account.js")



const authenticateusertoken = async(req,res,next) =>
{
    const token = req.cookies.token;
    if(!token)
    {
        return res.json({message:"Access denied no token"})
    }

    try
    {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        

        const loggeduser = await User.findOne({_id:decoded._id});
        
        req.user = loggeduser;
        req.token = token;
        next();
    } catch(error)
    {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}

module.exports = {authenticateusertoken}