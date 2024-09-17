import { useContext, useEffect, useRef, useState } from "react"
import UserProfileCard from "./UserProfileCard"
import UserCardLoading from "./UserCardLoading";
import axios from "axios";
import { toast } from "react-toastify";
import {motion} from 'framer-motion'
import { RxCross2 } from "react-icons/rx";
import { ChatContext } from "../context/chatProvider";

interface UserDataType {
  id : string
  username : string,
  email : string,
  image : string
}

export default function SideDrawer() {
  const [usersData,setUsersData] = useState<UserDataType[]>([])
  const [search,setSearch] = useState<string>("");
  const [loading,setLoading] = useState<boolean>(false);
  const chatContext = useContext(ChatContext);
  const drawerRef = useRef<HTMLDivElement | null>(null)

  if(!chatContext){
    return null;
  }

  const {isSideDrawerOpen,setIsSideDrawerOpen,setSelectedChat,chats,setChats} = chatContext;

  const fetchUsersData = async () => {
    try{
      setLoading(true);
      if(!search){
        toast.error("Enter something on search",{
          position : 'top-right'
        })

        return;
      }
      const res = await axios.get(`https://chatter-box-fsso.onrender.com/api/auth?search=${search}`,{
        headers : {
          Authorization : localStorage.getItem("token")
        }
      })  
      if(res.data.success){
        setUsersData(res.data.users)
      }
    }catch(err){
      console.log(err)
    }finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsSideDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSideDrawerOpen]);
  
  const accessChats = async (userId: string) => {
    try {
      const res = await axios.post("https://chatter-box-fsso.onrender.com/api/chat",{userId : userId},{
        headers : {
          Authorization : localStorage.getItem("token")
        }
      })

      if(res.data.success){
        if(!chats?.find((c) => c.id === res.data.chat.id)) setChats([res.data.chat,...(chats as [])])
        setSelectedChat(res.data.chat)
        setIsSideDrawerOpen(false);
      }

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div  className="absolute h-full w-full bg-[rgba(0,0,0,0.56)]">
      <motion.div initial={{x : "-100%"}} animate={{x : 0}} transition={{duration : 0.5}} className="bg-white w-[300px] h-full" ref={drawerRef}>
        <div className="py-4 px-4 flex items-center justify-between text-lg font-semibold border border-b-gray-200">
          <h1>Search Users</h1>
          <RxCross2 size={22} color="gray" className="cursor-pointer" onClick={() =>setIsSideDrawerOpen(false)} />
        </div>
        <div className="px-4 py-3 flex gap-4">
          <input type="text" placeholder="search..." value={search} onChange={(e) => setSearch(e.target.value)} className="outline-blue-600 px-2 py-1 text-sm font-semibold border-2 rounded-md border-blue-600" size={20} />
          <button className="bg-gray-200 rounded-md px-2" onClick={fetchUsersData}>Go</button>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-120px)]">
          { loading ? <UserCardLoading></UserCardLoading> :
            usersData.map((data,index) => {
              return (
                <UserProfileCard key={index} username={data.username} email={data.email} image={data.image} handleFunction={() => accessChats(data.id)}></UserProfileCard>
              )
            })
          }
        </div>
      </motion.div>
    </div>
  )
}
