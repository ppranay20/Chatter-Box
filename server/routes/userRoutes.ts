import express, { Router } from 'express'
import  { loginController }  from '../controllers/loginController';
import  { signupController }  from '../controllers/signupController';

import multer from 'multer';
import { allUsers } from '../controllers/userController';
import { verifyToken } from '../middleware/authMiddleware';

const userRouter : Router = express.Router();

const storage = multer.diskStorage({
    destination : "uploads",
    filename(req, file, callback) {
        callback(null,`${Date.now()}${file.originalname}`)
    },
})

const upload = multer({storage});

userRouter.post("/login",loginController);
userRouter.post("/signup",upload.single('image'),signupController);
userRouter.get('/',verifyToken,allUsers);

export default userRouter;