const asyncHandler = require('express-async-handler');
const User = require('../models/UserModel');
const generateToken = require('../config/Token')
const registerUser =  asyncHandler(async (req,res) => {
    let statusCode = 200;
try{
    
    const {name,email,password,pic} = req.body;
    
    if(!name || !email || !password){
        statusCode = 400;
        
        throw new Error("All fields are required");
    }

    const userExists = await User.findOne({
        email : email
    })
    if(userExists){
        
        statusCode = 400;
        throw new Error("User already exists");
    }
    const user = await User.create({
        name,
        email,
        password,
        pic
    })

    if(user){
       res.status(201).json({
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token : generateToken(user._id)
       });
    }else{
       
        statusCode = 500;
        throw new Error("Failed to create user , Please try again.")
    }
}catch(error){
    
    res.status(statusCode).json({ success: false, message: error.message});
   
        
}
})


const authUser = asyncHandler(async(req,resp) => {
    const {email,password} = req.body;

    const user = await User.findOne({
        email : email,
    });
    if(user && (await user.matchPassword(password))) {
        resp.json({
            _id : user._id,
            name : user.name,
            email : user.email,
            pic : user.pic,
            token : generateToken(user._id)
        })
    }else{
        resp.status(401);
        throw new Error("Invalid email or password");
    }
});


const getAllUsers = asyncHandler(async(req,resp) => {
    const key = req.query.search ? {
        $or : [
            {name:{$regex:req.query.search,$options:"i"}},
            {email:{$regex:req.query.search,$options:"i"}},
        ]
    }
    : { };

    const users = await User.find(key).find({_id:{$ne:req.user._id}});
    resp.send(users);
})

const updatePic = asyncHandler(async (req,resp)=> {
    let statusCode = 200;
    try{
        if(!req.body.url){
            statusCode = 400;
            throw new Error("Inavlid Request");
            
        } else{
            const result = await User.updateOne({_id:req.user._id},{
                $set:{pic:req.body.url}
            });
            if(result.modifiedCount >= 1){
                const user =  await User.findOne(req.user._id).select("-password");
                resp.json(user);
            }else{
                statusCode = 500;
                throw new Error("Error while updating pic");
            }
        }   
    }catch(err){
        resp.status(statusCode);
        resp.send(err.message);
    }
})

module.exports = {registerUser, authUser , getAllUsers, updatePic}