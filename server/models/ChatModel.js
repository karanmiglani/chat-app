//chatname
//isGroupCHat
//users
//latestmessage
//groupAdmin
//messageDateANdTime
let mongoose = require('mongoose');
const chatModel = mongoose.Schema({
    chatName:{type:String,trim:true},
    isGroupChat:{type:Boolean,default:false},
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users"
    }],
    latestMessage:{type:mongoose.Schema.Types.ObjectId,ref:"messages"},
    groupAdmin:{
        type :mongoose.Schema.Types.ObjectId,
        ref:"users"
    },
    
},{
    timestamps:true
})


const Chat = mongoose.model('Chat',chatModel);

module.exports = Chat;