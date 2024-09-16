import { loginSchema } from "../utils/zod/user";
import { Request,Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const loginController = async (req : Request,res : Response) => {
    try {
        const prisma = new PrismaClient();
        const data = req.body;
        
        const {success} = loginSchema.safeParse(data);
    
        if(!success){
            return res.json({
                success : false,
                message : "Bad Credentials"
            })
        }
        
        const isUserExist = await prisma.users.findUnique({
            where : {
                email : data.email
            },
        })
    
        if(!isUserExist){
            return res.json({
                success : false,
                message : "User does not exist"
            })
        }
    
        const isTrueUser = await bcrypt.compare(data.password,isUserExist.password);

        const token = await jwt.sign({id : isUserExist.id},process.env.JWT_SECRET!);

        const user = {
            id : isUserExist.id,
            email : isUserExist.email,
            username : isUserExist.username,
            image : isUserExist.image
        }

        if(isTrueUser){
            return res.json({
                success : true,
                user : user,
                token : token,
                message : "Loggin in Successfully"
            })
        }

        else{
            return res.json({
                success : false,
                message : "Incorrect Password"
            })
        }

    } catch (err) {
        console.log(err);
    }
   
}