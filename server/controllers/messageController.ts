import { Request,Response } from "express"
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const sendMessage = async (req : Request, res : Response) => {
    const data = req.body;

    if(!data.content || !data.chatId) {
        return res.json({
            success : false,
            message : "Pass all data"
        })
    }

    if(!req.user){
        return res.json({
            success : false,
            message : "Sender not authenticated"
        })
    }

    try{
        const message = await prisma.message.create({
            data : {
                sender : { connect : { id : req.user.id}},
                content : data.content,
                chat : {connect : {id : data.chatId}}
            },
            include : {
                sender : {
                    select : {id : true , username : true , email : true , image : true}
                },
                chat : {
                    include : {
                        users : {
                            select : {id : true, email : true , username : true , image : true}
                        }
                    }
                }
            }
        })

        const updateLatestMessage = await prisma.chat.update({
            where : {
                id : data.chatId
            },
            data : {
                messageId : message.id
            }
        })
        
        if(updateLatestMessage) return res.json({
            success : true,
            _message : message
        })

    }catch(err){
        console.log(err)
    }
}

export const allMessages = async (req : Request , res : Response) => {
    try{
        const messages = await prisma.message.findMany({
            where : {
                chatId : req.params.chat
            },
            include : {
                sender : {
                    select : {id : true , username : true , email : true , image : true}
                },
                chat : true
            }
        })
        
        if(messages) {
            return res.json({
                success : true,
                messages : messages,
            })
        }

    }catch(err){
        console.log(err)
    }
}
