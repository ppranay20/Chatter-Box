import express, { Router } from 'express'
import  { loginController }  from '../controllers/loginController';
import  { signupController }  from '../controllers/signupController';

import multer from 'multer';

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

export default userRouter;