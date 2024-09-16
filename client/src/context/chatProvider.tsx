import { createContext, ReactNode, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { messageType, userType } from "../utils/types";
import { ChatContextType } from "../utils/types";
import { selectedChatType } from "../utils/types";

export const ChatContext = createContext<ChatContextType | null>(null);

const ChatContextProvider : React.FC<{children : ReactNode}> = ({children}) => {
    const [user,setUser] = useState<userType | null>(null);
    const [showUserProfile,setShowUserProfile] = useState<boolean>(false);
    const [isSideDrawerOpen,setIsSideDrawerOpen] = useState<boolean>(false);
    const [selectedChat , setSelectedChat] = useState<selectedChatType | null>(null);
    const [chats,setChats] = useState<selectedChatType[]>([]);
    const [newGroupChat,setNewGroupChat] = useState<boolean>(false);
    const [showSendersProfile,setShowSendersProfile] = useState<boolean>(false);
    const [senderDetails,setSenderDetails] = useState<userType | null>(null)
    const [showGroupModal,setShowGroupModal] = useState<boolean>(false);
    const [fetchAgain,setFetchAgain] = useState<boolean>(false);
    const [notification,setNotification] = useState<messageType[]>([])
    const navigate = useNavigate();
    const location = useLocation()
    
    useEffect(() => {
        const getUser = localStorage.getItem("userInfo")
        if(!getUser){
            if(location.pathname !== "/signin" && location.pathname !== "/signup")
            navigate("/signup")
        }else{
            setUser(JSON.parse(getUser));
        }
    },[navigate,location])

    return (
        <ChatContext.Provider value={{user,setUser,showUserProfile,setShowUserProfile,isSideDrawerOpen,setIsSideDrawerOpen,selectedChat,setSelectedChat,chats,setChats,newGroupChat,setNewGroupChat,showSendersProfile,setShowSendersProfile,senderDetails,setSenderDetails,showGroupModal,setShowGroupModal,fetchAgain,setFetchAgain,notification,setNotification}}>
            {children}
        </ChatContext.Provider>
    )
}

export default ChatContextProvider;

