import express from 'express';
import { verifyToken } from '../middleware/authMiddleware';
import { allMessages, sendMessage } from '../controllers/messageController';

const messageRouter = express.Router();

messageRouter.post('/',verifyToken,sendMessage);
messageRouter.get('/:chat',verifyToken,allMessages);

export default messageRouter;