const Jwt = require('jsonwebtoken');
const User  = require('../models/UserModel');
const asyncHandler = require('express-async-handler');


const protect = asyncHandler(async (req,resp,next) => {
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try{
            token = req.headers.authorization.split(" ")[1];

            // decodes token id
            const decodedTokenId = Jwt.verify(token,"karan");
            req.user = await User.findById(decodedTokenId.id).select('-password');
            next();
        }catch(err){
            resp.status(401);
            throw new Error("Token authorization failed");
        }
    }
    if(!token){
        resp.status(401);
            throw new Error("No token found , Inavlid request");
    }
});


module.exports = {protect};