const mongoose = require('mongoose');

const messageModel = mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:"users"},
    content:{type:String,trim:true},
    chat:{
        type:mongoose.Schema.Types.ObjectId,ref:"Chat"
    }

},{
    timestamps:true
})


const Message = mongoose.model('messages',messageModel);
module.exports = Message;