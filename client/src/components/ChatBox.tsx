import { useContext, useEffect, useState } from "react"
import { FaEye } from "react-icons/fa";
import { ChatContext } from "../context/chatProvider"
import { userType } from "../utils/types";
import { FaArrowRight } from "react-icons/fa6";
import axios from "axios";
import { toast } from "react-toastify";
import Chats from "./Chats";
import { messageType } from "../utils/types";
import Spinner from "./Spinner";
import io from 'socket.io-client';

const ENDPOINT = "https://chatter-box-fsso.onrender.com";
let socket : any;

export default function ChatBox() {
  const chatContext = useContext(ChatContext);
  const [newMessage,setNewMessage] = useState<string>("");
  const [messages,setMessages] = useState<messageType[]>([]);
  const [loading,setLoading] = useState<boolean>(false);
  
  if(!chatContext) return null;
  
  const { user,selectedChat,setShowSendersProfile,setSenderDetails,setShowGroupModal,notification,setNotification,fetchAgain,setFetchAgain } = chatContext;
  
  useEffect(() => {
    socket = io(ENDPOINT,[
      transports : ['websocket','polling'],
      secure : true,
    ]);
    socket.emit("setup",user);
  },[user])
  
  const getSenderDetails = (loggedUser : userType , users : userType[]) => {
    if(users[0].id === loggedUser.id){
      setSenderDetails(users[1]);
      return users[1];
    }else{
      setSenderDetails(users[0]);
      return users[0];
    }
  }
  
  const sendMessage = async (e : any) => {
    e.preventDefault();
    if(!newMessage){
      toast.error("Enter some message",{
        position : 'top-center'
      })
      return;
    }
    
    try{
      const tempMessage = newMessage;
      setNewMessage("");
      const res = await axios.post("https://chatter-box-fsso.onrender.com/api/message",{
        chatId : selectedChat?.id,
        content : tempMessage
      },{
        headers : {
          Authorization : localStorage.getItem("token")
        }
      })
      
      if(res.data.success){
        socket.emit('new-message',res.data._message);
        setMessages((prevMessage) =>  [...prevMessage,res.data._message]);
      }
    }catch(err){
      console.log(err)
    }
  }
  
  const fetchMessage = async () => {
    setLoading(true);
    try{
      const res = await axios.get(`https://chatter-box-fsso.onrender.com/api/message/${selectedChat?.id}`,{
        headers : {
          Authorization : localStorage.getItem("token")
        }
      })
      
      if(res.data.success){
        setMessages(res.data.messages);
        socket.emit('join-room',selectedChat?.id)
      }
    }catch(err){
      console.log(err)
    }
    setLoading(false);
  }
  
  useEffect(() => {
    if(!selectedChat || !selectedChat.id) return;
    fetchMessage();

  },[selectedChat])


  useEffect(() => {
      socket.on('message-received',(message : messageType) => {
      
      if(!selectedChat || selectedChat.id !== message.chat.id){
        if(!notification.includes(message)){
          setNotification((prevState) => [message,...prevState]);
          setFetchAgain(!fetchAgain);
        }
      } else{
        setMessages((prevMessage) => [...prevMessage,message])
      }
    })
  },[notification,selectedChat,fetchAgain])
  
  
  return (
    <div className="w-[60%] bg-white rounded-md">
      {
        selectedChat ?
        <div>
          {
            selectedChat.isGroupChat ? 
            <div className="flex justify-between mx-6 mt-4 items-center">
              <p className="text-2xl">{selectedChat.chatName.toUpperCase()}</p>  
              <div className="border bg-gray-200 px-3 py-3 rounded-md cursor-pointer" onClick={() => setShowGroupModal(true)}>
                <FaEye size={20} />
              </div>
            </div>
            : 
            <div className="flex justify-between mx-6 mt-4 items-center">
              <p className="text-2xl">{getSenderDetails(user!,selectedChat.users).username}</p>
              <div className="border bg-gray-200 px-3 py-3 rounded-md cursor-pointer" onClick={() => setShowSendersProfile(true)}>
                <FaEye size={20} />
              </div>
            </div>
          }
          <div className="border flex flex-col mt-4 mb-5 mx-5 h-[440px] rounded-md bg-[#E8E8E8]">
            <div className="flex-grow overflow-y-auto">
              {loading ? <div className="flex justify-center items-center h-full"><Spinner></Spinner></div>  : <div className="px-3"><Chats messages={messages} /></div>}
            </div>
            <form className="flex gap-2 items-end pb-2 px-3" onSubmit={sendMessage}>
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} className="bg-[#E0E0E0] py-2 rounded-md px-3 w-full  outline-blue-500" size={88} placeholder="Enter a message..." />
                <button type="submit" className="border rounded-full bg-white px-2 py-2"><FaArrowRight /></button>
            </form>
          </div>
         </div> 
         : 
           <div className="flex justify-center items-center h-full text-2xl"><p>Click on a user to start chatting</p></div>
      }
    </div>
  )
}
  
