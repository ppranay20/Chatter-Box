export interface userType {
    id : string,
    username : string,
    email : string,
    image : string
}

export interface selectedChatType {
    adminId : string,
    chatName : string,
    createdAt : Date,
    id : string,
    isGroupChat : boolean,
    latestMessage : string,
    messageId : string,
    users : userType[]
    
}

export interface ChatContextType {
    user : userType | null,
    setUser : React.Dispatch<React.SetStateAction<userType | null>>,
    showUserProfile : boolean,
    setShowUserProfile : React.Dispatch<React.SetStateAction<boolean>>
    isSideDrawerOpen : boolean,
    setIsSideDrawerOpen : React.Dispatch<React.SetStateAction<boolean>>,
    selectedChat : selectedChatType | null,
    setSelectedChat : React.Dispatch<React.SetStateAction<selectedChatType | null>>,
    chats : selectedChatType[],
    setChats : React.Dispatch<React.SetStateAction<selectedChatType[]>>,
    newGroupChat : boolean,
    setNewGroupChat : React.Dispatch<React.SetStateAction<boolean>>
    showSendersProfile : boolean,
    setShowSendersProfile : React.Dispatch<React.SetStateAction<boolean>>
    senderDetails : userType | null,
    setSenderDetails : React.Dispatch<React.SetStateAction<userType | null>>
    showGroupModal : boolean,
    setShowGroupModal : React.Dispatch<React.SetStateAction<boolean>>
    fetchAgain : boolean
    setFetchAgain : React.Dispatch<React.SetStateAction<boolean>>
    notification : messageType[],
    setNotification : React.Dispatch<React.SetStateAction<messageType[]>>
}

export interface messageType {
    id : string,
    chat : selectedChatType,
    content : string,
    sender : userType,
    senderId : string
}