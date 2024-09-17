import express from 'express'
import { Request,Response } from 'express';
import 'dotenv/config'
import userRouter from './routes/userRoutes';
import chatRouter from './routes/chatRoutes';
import messageRouter from './routes/messageRoutes';
import cors from 'cors';
import {Server} from 'socket.io';
import { createServer } from 'http';

const app = express();
const PORT = 3000;
const httpServer = createServer(app);
const io = new Server(httpServer,{
    pingTimeout : 30000,
    cors : {
        origin : "https://chatter-box-9nej.onrender.com/"
    }
});

app.use(express.json());
app.use(cors());
app.use("/api/auth",userRouter);
app.use("/api/chat",chatRouter);
app.use("/api/message",messageRouter);
app.use('/image',express.static('uploads'));

io.on('connection',(socket) => {
    console.log("connected to socket.io");
    socket.on('setup',(user) => {
        if(user){
            socket.join(user.id);
        }
    })

    socket.on('join-room',(room) => {
        socket.join(room);
        console.log("user joined room " + room)
    })

    socket.on('new-message',(message) => {
        let chat = message.chat;
        if(!chat.users) console.log("No users in current chat");

        chat.users.forEach((user : any) => {
            if(user.id === message.sender.id) return;
            
            socket.in(user.id).emit('message-received',message);
        })
    })

    socket.off('setup',(user) => {
        console.log("User disconnected")
        socket.leave(user.id)
    })
})

httpServer.listen(PORT,() => {
    console.log("Server is running in port " + PORT)
})
