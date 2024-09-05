import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { accessChat,fetchChats } from '../controllers/chatController';

const chatRouter = express.Router();

chatRouter.post("/",verifyToken,accessChat);
chatRouter.get("/",verifyToken,fetchChats)
// chatRouter.post("/group",verifyToken,createGroupChat)
// chatRouter.put("/rename",verifyToken,renameGroupChat)
// chatRouter.put("/groupRemove",verifyToken,removeFromGroup);
// chatRouter.put("groupadd",verifyToken,addToGroup);

export default chatRouter;