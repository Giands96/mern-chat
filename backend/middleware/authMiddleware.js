const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncHandler = require('express-async-handler');

const protect = asyncHandler(async(req,res,next)=>{
    let token;

    if(req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ){
        try{
            token = req.headers.authorization.split(" ")[1];
            //Decodificar token id
            const decode = jwt.verify(token,process.env.JWT_SECRET);
            req.user=await User.findById(decode.id).select("-password");
            next();
        } catch (err){
            res.status(401);
            throw new Error("Usuario no autorizado, token erroneo");
        }
    } if(!token){
        res.status(401);
        throw new Error("Usuario no autorizado, token inexistente");
    }
})

module.exports = { protect };