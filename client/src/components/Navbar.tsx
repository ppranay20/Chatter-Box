import { FaBell } from "react-icons/fa";
import { FaAngleDown } from "react-icons/fa6";
import { FaSearch } from "react-icons/fa";
import { useContext, useState } from "react";
import { AnimatePresence, motion } from 'framer-motion'
import { ChatContext } from "../context/chatProvider";
import { messageType, userType } from "../utils/types";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const [dropdown,setDropdown] = useState<Boolean>(false)
    const [haveNotifications,setHaveNotifications] = useState<boolean>(false);
    const chatContext = useContext(ChatContext);
    const navigate = useNavigate();

    if(!chatContext){
        return null;
    }

    const {user,setShowUserProfile,showUserProfile,setIsSideDrawerOpen,notification,setSelectedChat,setNotification} = chatContext;

    const handleMyProfile = () => {
        setDropdown(!dropdown);
        setShowUserProfile(!showUserProfile)
    }

    const handleSearch = () => {
        setIsSideDrawerOpen(true);
    }

    const getSenderDetails = (loggedUser : userType , users : userType[]) => {
        if(users[0].id === loggedUser.id){
          return users[1].username;
        }else{
          return users[0].username;
        }
      }

    const handleNotification = (notify : messageType) => {
        setSelectedChat(notify.chat);
        setNotification(notification.filter(noti => noti.id !== notify.id))
    }

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userInfo");
        navigate("/signup")
    }

  return (
    <div className="bg-white flex justify-between items-center px-6 py-4">
        <div className="hover:bg-gray-200 hover:rounded-md px-3 py-2 cursor-pointer" onClick={handleSearch}>
            <div className="flex items-center gap-3">
                <FaSearch size={20} />
                <h1 className="font-semibold">Search User</h1>
            </div>
        </div>
        <h1 className="text-xl font-semibold">Chatter-Box</h1>
        <div className="flex items-center gap-6 relative">
        <div className="relative cursor-pointer" onClick={() => setHaveNotifications(!haveNotifications)}>
            <FaBell size={24} />                    
            {notification.length > 0 && (
                <span className="absolute bottom-4 left-4 flex justify-center items-center h-2.5 w-2.5 rounded-full bg-red-500 text-white text-xs">
                </span>
            )}
        </div>
            <AnimatePresence>
             {
                 haveNotifications &&
                 <motion.div initial={{opacity : 0 , y : -10}} animate={{opacity : 1 , y : 0}} exit={{opacity : 0 , y : -10}} transition={{duration : 0.3}} className="absolute top-10 right-32 cursor-pointer rounded-md w-[200px] border bg-white px-2 py-2">
                {
                    notification.length ? notification.map((notify) => {
                        return(
                            <div key={notify.id} onClick={() => handleNotification(notify)}>
                                {
                                    notify.chat.isGroupChat ? `New message from ${notify.chat.chatName}` : `New message from ${getSenderDetails(user!,notify.chat.users)}`
                                }
                            </div>
                        )
                    }) : <p>No new Messages</p>
                }
                </motion.div>
             }   
             </AnimatePresence>
            <div className={`flex items-center gap-2 hover:bg-gray-200 hover:rounded-md px-3 py-1 ${dropdown ? "bg-gray-200 rounded-md" : ""}`}>
                <img className="w-9 h-9 rounded-full" src="https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg" alt="Rounded avatar" />
                <FaAngleDown onClick={() => setDropdown(!dropdown)} className="cursor-pointer" />
            </div>
            <AnimatePresence>
            {
                dropdown &&
                <motion.div initial={{opacity : 0 , y : -10}} animate={{opacity : 1 , y : 0}} exit={{opacity : 0 , y : -10}} transition={{duration : 0.3}} className="absolute top-[46px] right-6 text-gray-600 w-32 bg-white border rounded-md px-4 py-2 flex flex-col gap-3">
                <p className="cursor-pointer" onClick={handleMyProfile}>My Profile</p>
                <p className="cursor-pointer" onClick={handleLogout}>Logout</p>
            </motion.div>
            }
            </AnimatePresence>
        </div>
    </div>
  )
}
