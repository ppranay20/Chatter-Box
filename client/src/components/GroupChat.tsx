import { useContext, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { ChatContext } from "../context/chatProvider";
import '../App.css'
import { userType } from "../utils/types";
import axios from "axios";
import UserProfileCard from "./UserProfileCard";
import Spinner from "./Spinner";
import { toast } from "react-toastify";

export default function GroupChat() {
    const chatContext = useContext(ChatContext);
    const [groupName,setGroupName] = useState<string | null>("");
    const [selectedUsers,setSelectedUsers] = useState<userType[]>([]);
    const [searchResult,setSearchResult] = useState<userType[]>([]);
    const [loading,setLoading] = useState<boolean>(false);

    if(!chatContext){
        return null;
    }

    const {setNewGroupChat,setChats,chats} = chatContext;

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

    const makeGroupChat = async () => {
        if(!groupName) {
            toast.error("Add a group name",{
                position : 'top-right'
            })
        }
        if(!selectedUsers){
            toast.error("Add members to group",{
                position : 'top-right'
            })
        }

        try{
            const res = await axios.post("https://chatter-box-fsso.onrender.com/api/chat/group",{
                name : groupName,
                users : selectedUsers
            }, {
                headers : {
                    Authorization : localStorage.getItem("token")
                }
            })

            if(res.data.success){
                setChats([res.data.groupChat,...chats])
                setNewGroupChat(false);
                toast.success("Group chat created",{
                    position : 'top-center'
                })
            }else if(!res.data.success){
                toast.error(res.data.message,{
                    position : 'top-right'
                })
            }
        }catch(err){
            console.log(err)
        }
    }

    const addToGroup = (user : userType) => {
        if(selectedUsers.find(((users) => users  === user))){
            toast.error("User already present",{
                position : 'top-right'
            })
        }else{
            setSelectedUsers([...selectedUsers,user]);
        }
    }

    const removeFromGroup = (user : userType) => {
        setSelectedUsers(selectedUsers.filter((existingUser) => existingUser.id !== user.id));
    }

  return (
    <div className="absolute bg-[rgba(0,0,0,0.56)] h-full w-full flex justify-center items-center animate-profile"> 
        <div className="border w-[400px] min-h-[200px] bg-white px-2 rounded-md">
            <div className="flex justify-end pt-2 text-gray-400 cursor-pointer" onClick={() => setNewGroupChat(false)}>
                <RxCross2 size={20} />
            </div>
            <h1 className="text-3xl text-center pb-8">Create Group Chat</h1>
            <div className="flex gap-3 flex-col mx-4">
                <input type="text" placeholder="Group Name" className="border border-gray-300 rounded-md px-2 py-1.5 outline-none" onChange={(e) => setGroupName(e.target.value)} />
                <input type="text" placeholder="User Name" className="border border-gray-300 rounded-md px-2 py-1.5 outline-none" onChange={(e)=> searchParticipants(e.target.value)} />
            </div>
            <div className="flex ml-3 flex-wrap">
                {
                    selectedUsers.map((data,index) => {
                        return (
                            <div key={index} className="flex gap-3 bg-purple-500 py-1 items-center rounded-md text-xs px-2 cursor-pointer mx-1 my-2 text-white" onClick={() => removeFromGroup(data)}>
                                <p>{data.username}</p>
                                <RxCross2 size={14} />
                            </div>
                        )
                    })
                }
            </div>
            <div>
                {
                    loading ? <div className="relative left-40 top-2"><Spinner></Spinner></div> : (searchResult.slice(0,4).map((data,index) => {
                        return(
                            <UserProfileCard key={index} username={data.username} email={data.email} image={data.image} handleFunction={() => addToGroup(data)}></UserProfileCard>
                        )
                    }))
                }
            </div>
            <div className="py-5 flex justify-end mx-4">
                <button className="text-white bg-blue-600 rounded-md px-2 py-2" onClick={makeGroupChat}>Create Chat</button>
            </div>
        </div>
    </div>
  )
}
