const asyncHandler = require('express-async-handler');
const Message = require('../models/MessageModel');
const users = require('../models/UserModel');
var Chat = require('../models/ChatModel');
const sendMessgae = asyncHandler(async (req,resp) => {
   const {content , chatId } = req.body;
   const statuCode = 200;
   if(!content || !chatId){
    statuCode = 400;
    throw new Error('Invalid data passed into request');
   }
   var newMessage = {
    sender : req.user._id,
    content : content,
    chat : chatId
   }

   try{
    var message = await Message.create(newMessage);
    message = await message.populate("sender","name pic");
    message = await message.populate("chat");
    message = await users.populate(message,{
        path:"chat.users",
        select : "name email pic",
    });
    await Chat.findByIdAndUpdate(req.body.chatId,{
        latestMessage : message,
    })
    resp.status(200).json(message);
   }catch(err){
    resp.status(statuCode);
    resp.json({status:false , message:err.message});
        throw new Error(err.message);
   }
});


const getAllMessages = asyncHandler( async (req,resp) => {

    try{
        const messages = await Message.find({chat:req.params.chatId}).populate(
            "sender", 
            "name pic email"
            ).populate("chat");
            resp.status(200).json(messages);
    }catch(error){
        resp.status(400);
        resp.json({status:false , message:err.message});
            throw new Error(err.message);
    }
})


module.exports = {sendMessgae , getAllMessages};