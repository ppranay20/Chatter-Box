import { useContext } from "react";
import { ChatContext } from "../context/chatProvider";

export default function UserProfile() {
    const chatContext = useContext(ChatContext);

    if(!chatContext){
        return null;
    }

    const {user} = chatContext;

    const {setShowUserProfile,showUserProfile} = chatContext;

    const handleOnClick = () => {
        setShowUserProfile(!showUserProfile)
    }

  return (
    <div className="absolute flex items-center justify-center w-full h-full bg-[rgba(0,0,0,0.56)]">
        <div className="animate-profile bg-white py-3 w-[400px] rounded-md mb-[240px] px-4">
            <div className="flex items-center flex-col gap-y-3">
                <h1 className="text-center text-2xl font-semibold py-2 font-mono">{user?.username}</h1>
                <img className="w-28 h-28 rounded-full" src={user?.image} alt="user-image" />
                <p className="text-gray-500 text-xl py-2 px-3">Email : {user?.email}</p>
            </div>
            <div className="flex justify-end">
                <button className="bg-blue-700 px-3 py-1 rounded-md text-white border" onClick={handleOnClick}>Close</button>
            </div>
        </div>
    </div>
  )
}
