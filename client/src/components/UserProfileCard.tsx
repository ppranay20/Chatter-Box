interface userProfileCardProps {
    username : string,
    email : string,
    image : string,
    handleFunction : () => void
}

export default function UserProfileCard({username , email , image,handleFunction} : userProfileCardProps) {
  console.log(image);

  return (
    <div className="bg-gray-200 my-3 mx-4 py-2 px-2 rounded-md flex items-center gap-2 cursor-pointer hover:bg-slate-400 transition duration-300" onClick={handleFunction}>
        <img src={`https://chatter-box-fsso.onrender.com/image/${image}`} alt="user-image" className="w-10 h-10 rounded-full" />
        <div>
            <p className="text-[16px]">{username}</p>
            <p className="text-xs"><span className="font-bold">Email</span> : {email}</p>
        </div>
    </div>
  )
}
