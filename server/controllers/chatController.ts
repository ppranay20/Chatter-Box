import { PrismaClient } from "@prisma/client";
import {Request,Response} from 'express'

interface userType {
    id : string,
    username : string,
    email : string,
    image : string
}

const prisma = new PrismaClient();

export const accessChat = async (req : Request , res : Response) => {
    const { userId } = req.body

    if(!req.user){
        return res.json({
            success : false,
            message : "user not authenticated"
        })
    }

    if(!userId){
        return res.json({
            success : false,
            message : "UserId Not Present"
        })
    }

    try{
        let isChat = await prisma.chat.findMany({
            where : {
                isGroupChat : false,
                AND : [
                    {users : {some : {id : req.user.id}}},
                    {users : {some : {id : userId}}}
                ]
            },
            include : {
                users : {
                    select : {id : true , username : true , email : true , image : true}
                },
                latestMessage : {
                    include : {
                        sender : {
                            select : {id : true,username : true , email : true , image : true}
                        }
                    }
                }
            }
        })

        if(isChat.length > 0){
            return res.json({
                success : true,
                chat : isChat[0]
            })
        } else{
            const chatData = {
                chatName: "sender",
                isGroupChat: false,
                users: {
                    connect : [
                        {id : req.user?.id},
                        {id : userId}
                    ]
                }
              };
              
            const createdChat = await prisma.chat.create({
            data: chatData,
            include : {
                users : {
                    select : { id : true ,username : true , email : true , image : true}
                },
                latestMessage : {
                    include : {
                        sender : {
                            select : {id : true,username : true , email : true , image : true}
                        }
                    }
                }
            }
            });

            return res.json({
                success : true,
                chat : createdChat
            })
        }
    }catch(err){
        console.log(err);
    }
}

export const fetchChats = async (req : Request , res : Response) => {
    try{
        if(!req.user){
            return res.json({
                success : false,
                message : "user not authenticated"
            })
        }
        const chats = await prisma.chat.findMany({
            where : {
                users : {
                    some : {id : req.user.id}
                }
            },
            include : {
                users : {
                    select : {id : true, username : true , email : true , image : true}
                },
                isGroupAdmin : {
                    select : {id : true, username : true , email : true , image : true}
                },
                latestMessage : {
                    select : {
                        sender : {
                            select : {
                                id : true,
                                email : true,
                                username : true,
                                image : true
                            }
                        }
                    }
                },
            },
            orderBy : {
                createdAt : 'desc'
            }
        })

        return res.json({
            success : true,
            chat : chats
        })
    } catch(err){
        console.log(err)
    }
}

export const createGroupChat = async (req : Request , res : Response) => {
    if(!req.body.name || !req.body.users){
        return res.json({
            success : false,
            message : "Fill the fields"
        })
    }

    if(!req.user){
        return res.json({
            success : false,
            message : "user not authenticated"
        })
    }

    if(req.body.users.length < 2){
        return res.json({
            success : false,
            message : "Atleast 3 members required to make a group"
        })
    }

    const groupParticipants = req.body.users.map((user : userType) => user.id);
    groupParticipants.push(req.user.id);

    try{
        const groupChat = await prisma.chat.create({
            data : {
                chatName : req.body.name,
                users : {
                    connect : groupParticipants.map((user : {id : string}) => {return {id : user}})
                },
                isGroupChat : true,
                isGroupAdmin : {
                    connect : {id : req.user.id}
                }
            }
        })
        
        const chat = await prisma.chat.findFirst({
            where : {
                id : groupChat.id
            },
            include : {
                users : {
                    select : {id : true , username : true , email : true, image : true}
                },
                isGroupAdmin : {
                    select : {id : true , username : true, email : true , image : true}
                }
            }
        })

        return res.json({
            success : true,
            groupChat : chat
        })

    }catch(err){
        console.log(err)
    }
}

export const renameGroup = async (req : Request , res : Response) => {    
    if(!req.body.name || !req.body.id){
        return res.json({
            success : false,
            message : "No id and name provided"
        })
    }

    try{
        const newGroupName = await prisma.chat.update({
            where : {
                id : req.body.id
            },
            data : {
                chatName : req.body.name
            },
            include : {
                users : {
                    select : {id : true , username : true , email : true , image : true}
                },
                isGroupAdmin : {
                    select : {id : true , username : true , email : true , image : true}
                }
            }
        })

        if(!newGroupName){
            return res.json({
                success : false,
                message : "Chat not found"
            })
        }
        else{
            return res.json({
                success : true,
                data : newGroupName,
                message : "Group Name Updated"
            })
        }

    }catch(err){
        console.log(err)
    }
}

export const addToGroup = async (req : Request , res : Response) => {
    if(!req.body.chatId || !req.body.userId) {
        return res.json({
            success : false,
            message : "data not provided"
        })
    }

    if(!req.user){
        return res.json({
            success : false,
            message : "Not Authenticated"
        })
    }
    
    try{
        const isAdmin = await prisma.chat.findFirst({
            where : {
                id : req.body.chatId
            },
            include : {
                isGroupAdmin : true
            }
        })

        if(isAdmin?.isGroupAdmin?.id !== req.user.id){
            return res.json({
                success : false,
                message : "You cannot add to group"
            })
        }

        const addUser = await prisma.chat.update({
            where : {
                id : req.body.chatId
            },
            data : {
                users : {
                    connect : {
                        id : req.body.userId
                    }
                }
            },
            include : {
                users : {
                    select : {id : true , username : true , email : true , image : true}
                },
                isGroupAdmin : {
                    select : {id : true , username : true , email : true , image : true}
                }
            }
        })
    
        if(!addUser) {
            return res.json({
                success : false,
                message : "Cannot add new user"
            })
        }

        return res.json({
            success : true,
            users : addUser,
            message : "User Added"
        })
    }catch(err){
        console.log(err)
    }
}

export const removeFromGroup = async (req : Request , res : Response) => {
    if(!req.body.chatId || !req.body.userId) {
        return res.json({
            success : false,
            message : "data not provided"
        })
    }


    if(!req.user){
        return res.json({
            success : false,
            message : "Not Authenticated"
        })
    }
    
    try{
        const isAdmin = await prisma.chat.findFirst({
            where : {
                id : req.body.chatId
            },
            include : {
                isGroupAdmin : true
            }
        })

        if(isAdmin?.isGroupAdmin?.id !== req.user.id){
            return res.json({
                success : false,
                message : "You cannot remove from the group"
            })
        }

        const removeUser = await prisma.chat.update({
            where : {
                id : req.body.chatId
            },
            data : {
                users : {
                    disconnect : {
                        id : req.body.userId
                    }
                }
            },
            include : {
                users : {
                    select : {id : true , username : true , email : true , image : true}
                },
                isGroupAdmin : {
                    select : {id : true , username : true , email : true , image : true}
                }
            }
        })

        if(!removeUser) {
            return res.json({
                success : false,
                message : "Cannot add new user"
            })
        }

        return res.json({
            success : true,
            users : removeUser,
            message : "User Added"
        })
        
    }catch(err){
        console.log(err)
    }
}