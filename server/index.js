const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes')
const ChatRoutes = require('./routes/ChatRoutes');
const MessageRoutes = require('./routes/MessageRoutes');
const {notFound , errorHandler}= require('./middleware/ErrorMiddleware');
dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());





app.use('/api/user',userRoutes);
app.use('/api/chat',ChatRoutes);
app.use('/api/message',MessageRoutes);

// ------------------------------------DEPLOYMENT-----------------------------------------------------//

const __dirnamee1 = path.resolve();
console.log("dirname is ", __dirnamee1);
console.log("Env is :",process.env.NODE_ENV);
if(process.env.NODE_ENV == 'production'){
    app.use(express.static(path.join(__dirnamee1,"frontend/build")));
    app.get("*",(req,resp)=> {
        console.log("Inside catch-all route");
        resp.sendFile(path.resolve(__dirnamee1,"frontend","build","index.html"));
    })
}else{
    console.log("Hello else block");
    app.get('/',(req,resp)=>{
        resp.send({"result":"API is not runing"});
    })
}


// ------------------------------------DEPLOYMENT-----------------------------------------------------//


app.use(notFound);
app.use(errorHandler);


const port = process.env.PORT || 4000;
const server = app.listen(port);

const io = require('socket.io')(server,{
    pingTimeout :600000
    ,cors:{
        origin:"http://localhost:3000"

    }
});

let onlineUsers = {};

io.on("connection",(socket)=>{
    console.log(`Connected to socket.io`);
    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        onlineUsers[userData._id] = true;
        socket.emit('connected');
        io.emit("updateUserStatus",{usersOnline:onlineUsers,status:'online'});
        socket.on('disconnect',()=>{
            delete onlineUsers[userData._id];
            console.log("User disconnected");
            io.emit("updateUserStatus",{usersOnline:onlineUsers,status:'online'});
        })
        
    })

   

    socket.on("join chat",(room)=> {
        socket.join(room);
        console.log("User joined rom: " + room);
    })

    socket.on('typing',(room)=>socket.in(room).emit("typing"))
    socket.on('stop typing',(room)=>socket.in(room).emit("stop typing"))



    socket.on("new message",(newMessageRecieved) => {
        var chat = newMessageRecieved.chat;
        if(!chat.users){
            return console.log("Chats.users are not defined");
        }
        chat.users.forEach(user => {
            
            if(user._id == newMessageRecieved.sender._id) return;
            socket.in(user._id).emit("message recieved",newMessageRecieved);
        })
       
    })
});

