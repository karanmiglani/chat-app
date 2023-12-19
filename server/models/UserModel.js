const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const userModel = mongoose.Schema({
    name:{type:String,trim:true,required:true},
    email:{type:String,trim:true,required:true,unique:true},
    password:{type:String,trim:true,required:true},    
    pic:{type:String,default:
        "https://icons-for-free.com/iconfiles/png/512/avatar+circle+male+profile+user+icon-1320196710301016992.png"
    },
},{
    timestamps:true
});

userModel.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}

userModel.pre('save',async function(next){
    if(!this.isModified){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password,salt);
})


const users = mongoose.model("users",userModel);

module.exports = users;