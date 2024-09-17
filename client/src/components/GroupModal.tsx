import { useContext, useState } from "react";
import { ChatContext } from "../context/chatProvider";
import { RxCross2 } from "react-icons/rx";
import { userType } from "../utils/types";
import { toast } from "react-toastify";
import axios from "axios";
import RenameSpinner from "./RenameSpinner";
import Spinner from "./Spinner";
import UserProfileCard from "./UserProfileCard";

export default function UserProfile() {
    const chatContext = useContext(ChatContext);
    const [groupChatName,setGroupChatName] = useState<string>("");
    const [searchResult,setSearchResult] = useState<userType[]>([]);
    const [renameLoading,setRenameLoading] = useState<boolean>(false);
    const [groupLoading,setGroupLoading] = useState<boolean>(false);
    const [loading,setLoading] = useState<boolean>(false);

    if(!chatContext){
        return null;
    }

    const {user,showGroupModal,setShowGroupModal,selectedChat,setSelectedChat,setFetchAgain,fetchAgain} = chatContext;

    const handleOnClick = () => {
        setShowGroupModal(!showGroupModal)
    }

    const removeFromGroup = async (user1 : userType) => {
        if(selectedChat?.adminId !== user?.id){
            toast.error("You are not admin of the group",{
                position : 'top-center'
            })

            return;
        }
        setGroupLoading(true);
        try{
            const res = await axios.put("https://chatter-box-fsso.onrender.com/api/chat/groupremove",{
                chatId : selectedChat?.id,
                userId : user1?.id 
            },{
                headers : {
                    Authorization : localStorage.getItem("token")
                }
            })

            if(res.data.success){
                if(user?.id === user1.id){
                    setSelectedChat(null);
                    toast.success("Group Removed",{
                        position : 'top-center'
                    })
                    setShowGroupModal(false);
                }else{
                    setSelectedChat(res.data.users);
                    toast.success("User removed",{
                        position : 'top-center'
                    })
                }
                setGroupLoading(false);
                setFetchAgain(!fetchAgain);
            }else{
                toast.error(res.data.message,{
                    position : 'top-center'
                })
            }
        }catch(err){
            console.log(err)
        }
    }

    const addNewUser = async (newUser : userType) => {
        if(selectedChat?.users.find((existingUser) => existingUser.id === newUser.id)){
            toast.error("User Already In Group",{
                position : 'top-center'
            })

            return;
        }

        if(selectedChat?.adminId !== user?.id){
            toast.error("You are not admin of the group",{
                position : 'top-center'
            })

            return;
        }

        try{
            const res = await axios.put("https://chatter-box-fsso.onrender.com/api/chat/groupadd",{
                chatId : selectedChat?.id,
                userId : newUser?.id
            },{
                headers : {
                    Authorization : localStorage.getItem("token")
                }
            })

            if(res.data.success){
                setSelectedChat(res.data.users);
                setFetchAgain(!fetchAgain);
                toast.success("User added successfully",{
                    position : 'top-center'
                })
            }else{
                toast.error(res.data.message,{
                    position : 'top-center'
                })
            }
        }catch(err){
            console.log(err)
        }
    }

    const renameGroupChat = async () => {
        if(!groupChatName) {
            toast.error("Enter a name first",{position : 'top-right'});
            return;
        }
        setRenameLoading(true);

        try{
            const res = await axios.put("https://chatter-box-fsso.onrender.com/api/chat/rename",{
                name : groupChatName,
                id : selectedChat?.id
            },{
                headers : {
                    Authorization : localStorage.getItem("token")
                }
            })

            if(res.data.success){
                setSelectedChat(res.data.data);
                setFetchAgain(!fetchAgain);
                toast.success(res.data.message,{
                    position : 'top-center'
                })
            }else{
                toast.error(res.data.message,{
                    position : 'top-center'
                })
            }
        }catch(err){
            console.log(err)
        }

        setGroupChatName('');
        setRenameLoading(false);
    }

    const searchParticipants = async (query : string) => {
        if(!query){
            setSearchResult([]);
            setLoading(false);
            return;
        }
        setLoading(true);

        try{
            const res = await axios.get(`https://chatter-box-fsso.onrender.com/api/auth?search=${query}`,{
                headers : {
                    Authorization : localStorage.getItem("token")
                }
            })

            if(res.data.success) {
                setSearchResult(res.data.users);
                setLoading(false);
            }

        }catch(err){
            console.log(err)
        }
    }

    return (
        <div className="absolute bg-[rgba(0,0,0,0.56)] h-full w-full flex justify-center items-center animate-profile"> 
            <div className="border w-[400px] min-h-[200px] bg-white px-2 rounded-md">
                <div className="flex justify-end pt-2 text-gray-400 cursor-pointer" onClick={handleOnClick}>
                    <RxCross2 size={20} />
                </div>
                <h1 className="text-3xl text-center pb-8">{selectedChat?.chatName}</h1>
                <div className="flex ml-3 flex-wrap mb-4">
                {
                    selectedChat?.users.map((data,index) => {
                        return (
                            <div key={index} className="flex gap-3 bg-purple-500 py-1 items-center rounded-md text-xs px-2 cursor-pointer mx-1 my-1 text-white" onClick={() => removeFromGroup(data)}>
                                <p>{data.username}</p>  
                                <RxCross2 size={14} />
                            </div>
                        )
                    })
                }
                </div>
                <div className="flex gap-3 flex-col mx-4">
                    <div className="flex gap-2">
                        <input type="text" placeholder="Group Name" size={30} value={groupChatName} className="border border-gray-300 rounded-md px-2 py-1.5 outline-none" onChange={(e) => setGroupChatName(e.target.value)} />
                        <button className="px-2 py-2 text-white bg-blue-500 rounded-md" onClick={renameGroupChat}>{renameLoading ? <RenameSpinner></RenameSpinner> : "Update"}</button>
                    </div>
                    <input type="text" placeholder="Add user to group" className="border border-gray-300 rounded-md px-2 py-1.5 outline-none" onChange={(e) => searchParticipants(e.target.value)} />
                </div>
                <div>
                {
                    loading ? <div className="relative left-40 top-2"><Spinner></Spinner></div> : (searchResult.slice(0,4).map((data,index) => {
                        return(
                            <UserProfileCard key={index} username={data.username} email={data.email} image={data.email} handleFunction={() => addNewUser(data)}></UserProfileCard>
                        )
                    }))
                }
            </div>
                <div className="py-5 flex justify-end mx-4">
                    <button className="text-white bg-red-600 rounded-md px-2 py-2" onClick={() => removeFromGroup(user!)}>{groupLoading ? <RenameSpinner></RenameSpinner> : "Leave Group"}</button>
                </div>
            </div>
        </div>
      )
    }
    
