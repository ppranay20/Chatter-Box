import { useContext, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { ChatContext } from "../context/chatProvider";
import axios from "axios";
import Spinner from "./Spinner";

interface loggedUserType {
  id : string,
  username : string,
  email : string,
  image : string
}

export default function MyChats() {
  const chatContext = useContext(ChatContext);
  const [loggedUser , setLoggedUser] = useState<loggedUserType>();
  const [loading,setLoading] = useState<boolean>(false);

  if(!chatContext){
    return null;
  }

const {setSelectedChat,setChats,chats,selectedChat,setNewGroupChat,fetchAgain} = chatContext;

  const fetchChats = async () => {
    setLoading(true);
    try{
      const res = await axios.get("https://chatter-box-fsso.onrender.com/api/chat",{
        headers : {
          Authorization : localStorage.getItem("token")
        }
      })

      if(res.data.success){
        setChats(res.data.chat);
        setLoading(false);
      }

    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    const user = localStorage.getItem("userInfo") as string; 
    setLoggedUser(JSON.parse(user));
    fetchChats();
  },[fetchAgain])

  const findSendersName = (loggedUser : loggedUserType,users : loggedUserType[]) => {
    return users[0].id === loggedUser.id ? users[1].username : users[0].username;
  }

  return (
    <div className="bg-white w-[35%] rounded-md py-4 px-4 h-[535px] overflow-y-auto overflow-x-hidden">
      <div className="flex justify-between items-center">
        <h1 className="text-xl">My Chats</h1>
        <div className="flex items-center gap-2 border bg-gray-300 rounded-md px-2 py-2 cursor-pointer hover:bg-slate-400 transition duration-200" onClick={() => setNewGroupChat(true)}>
          <p>New Group Chat</p>
          <FaPlus />
        </div>
      </div>
      <div className="mt-6">

        {
          loading ? <div className="relative left-44 top-36"><Spinner></Spinner></div> : (chats ?
          chats.map((chat,index) => {
            return(
              <div key={index} className={`border bg-gray-200 py-3 px-2 my-4 rounded-md cursor-pointer hover:bg-[#38B2AC] ${selectedChat === chat ? "bg-green-400 text-white" : "bg-[#E8E8E8] text-black"}`} onClick={() => setSelectedChat(chat)}>
                <p>{(chat.isGroupChat ? chat.chatName : findSendersName(loggedUser!,chat.users))}</p>
              </div>
            )
          })
          : <p>No chats Avalible</p>)
        }
      </div>
    </div>
  )
}
