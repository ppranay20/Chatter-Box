import express from 'express'
import { Request,Response } from 'express';
import 'dotenv/config'
import userRouter from './routes/userRoutes';
import chatRouter from './routes/chatRoutes';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());
app.use("/api/auth",userRouter);
app.use("/api/chat",chatRouter);

app.get("/",(req : Request , res : Response) => {
    res.send("Hello World");
})

app.listen(PORT,() => {
    console.log("Server is running in port " + PORT)
})