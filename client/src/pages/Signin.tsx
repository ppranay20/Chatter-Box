import { useNavigate } from "react-router-dom"
import { useState } from "react"
import axios from "axios";
import { toast } from "react-toastify";

interface signinType{
    email : string,
    password : string
}

export default function Signin() {
    const navigate = useNavigate();
    const [authData,setAuthData] = useState<signinType>({
        email : "",
        password : "",
    })

    const onChangeHandler = (e: any) => {
        var name = e.target.name;
        var value = e.target.value;

        setAuthData({...authData,[name] : value});
    }

    const handleLogin = async (e : any) => {
        e.preventDefault();

        try {
            const res = await axios.post("http://localhost:3000/api/auth/login",authData);
            if(res.data.success){
                localStorage.setItem("token",res.data.token);
                toast.success(res.data.message,{
                    position : "top-right"
                })
                setAuthData({
                    email : "",
                    password : ""
                })
                navigate("/");
            }else{
                toast.error(res.data.message,{
                    position : "top-right"
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#d0d4dd]">
        <div className="border w-[400px] px-5 shadow-md py-3 bg-white rounded-md">
            <h1 className="px-1 py-4 text-md text-center">Welcome to Chat Application</h1>
            <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="username" onChange={onChangeHandler} placeholder="Enter your password" className="bg-[#f0f1f5] rounded-md outline-blue-600 py-1 px-2 mb-3" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" placeholder="Enter your password" onChange={onChangeHandler} className="bg-[#f0f1f5] rounded-md outline-blue-600 py-1 px-2 mb-3" />
                </div>
                <div className="flex justify-center items-center">
                    <button type="submit" className="bg-blue-600 w-[350px] my-3 text-sm rounded-md py-2 text-white hover:text-black">Login</button>
                </div>
            </form>
            <p className="text-md text-center py-2">Dont have an account?<span className="underline px-1 hover:text-blue-700 cursor-pointer" onClick={() => navigate("/signup")}>Signup</span></p>
        </div>
    </div>
  )
}
