import { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const allUsers = async (req : Request , res : Response) => {
    if(!req.user){
        return res.json({
            success : false,
            message : "User not authorised"
        })
    }

    const searchQuery = req.query.search as string | undefined;

    const users = await prisma.users.findMany({
        where : {
            AND : [
                searchQuery ? {
                    OR : [
                        {username : {contains : searchQuery , mode : 'insensitive'}},
                        {email : {contains : searchQuery , mode : 'insensitive'}}
                    ]
                } : {},
                {id : { not : req.user.id}}
            ]
        },
        select : {id : true, username : true , email : true , image : true}
    })

    return res.json({
        success : true,
        users : users
    })
}