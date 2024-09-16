import { Request,Response } from "express"
import { signupSchema } from "../utils/zod/user"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { PrismaClient } from "@prisma/client"


export const signupController = async (req : Request,res : Response) => {
    try{
        const prisma = new PrismaClient();
        const userImage = req.file?.filename;
        const data = {...req.body,image : userImage};
        const {success} = signupSchema.safeParse(data);
    
        if(!success){
            return res.json({
                success : false,
                message : "Bad Credentials"
            })
        }
    
        const hashedPassword = await bcrypt.hash(data.password,10);
    
        const user = await prisma.users.create({
            data : {
                username : data.username,
                email : data.email,
                password : hashedPassword,
                image : data.image
            },
            select : {id : true , username : true , email : true , image : true}
        })

        const token = await jwt.sign({id : user.id} , process.env.JWT_SECRET!)

        if(user){
            res.json({
                success : true,
                token : token,
                user : user,
                message : "Account Created Successfully"
            })
        }

    }catch(err){
        console.log(err)
    }
}