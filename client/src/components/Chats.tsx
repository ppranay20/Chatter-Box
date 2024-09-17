import { messageType } from "../utils/types"
import { useContext } from "react"
import { ChatContext } from "../context/chatProvider"

export default function Chats({messages} : {messages : messageType[]}) {
    const chatContext = useContext(ChatContext);

    if(!chatContext) return null;

    const { user } = chatContext;

    if(!user) return null;

    const isSameSender = (messages: messageType[],currentMessage: messageType,index: number,userId: string) => {
        return(
            index < messages.length-1 && (messages[index+1]?.senderId !== currentMessage.senderId || messages[index+1] === undefined) && messages[index].senderId !== userId
        )
    }

    const isLastMessage = (messages : messageType[],index : number,userId : string) => {
        return(
            index === messages.length-1 && messages[messages.length-1].senderId !== userId
        )
    }

  return (
    <div>
        {messages.map((message,index) => {
            return(
                <div key={index} className={`flex items-center my-2 gap-2 ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                    {
                        ((isSameSender(messages,message,index,user.id) || isLastMessage(messages,index,user.id)) &&
                            <img className="w-9 h-9 rounded-full" src={`https://chatter-box-fsso.onrender.com/image/${message.sender.image}`} alt="Rounded avatar" />
                        )
                    }
                    <span className={`${message.sender.id === user.id ? "bg-[#BEE3F8]" : "bg-[#B9F5D0]"} px-3 py-2 rounded-lg text-sm` }>{message.content}</span>
                </div>
            )
        })}
    </div>
  )
}
