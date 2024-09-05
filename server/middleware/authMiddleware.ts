import { NextFunction,Request,Response } from "express";
import jwt from 'jsonwebtoken'
import { PrismaClient } from "@prisma/client";

interface JWT_Payload {
    id : string
}

export const verifyToken = async (req : Request,res : Response,next : NextFunction) => {
    try{
        const prisma = new PrismaClient();
        const token = req.headers.authorization as string;
        if(!token){
            return res.json({
                success : false,
                message : "No Token is there"
            })
        }
    
        const decoded = jwt.verify(token,process.env.JWT_SECRET!) as JWT_Payload;
        const userId = await prisma.users.findUnique({
            where : {
                id : decoded.id 
            },
            select : {
                id : true,
            }
        })

        if (!userId) {
            return res.status(401).json({
              success: false,
              message: "User not found",
            });
          }
    
        req.user = userId;
        next();
    }
    catch(err){
        console.log(err);
    }
}