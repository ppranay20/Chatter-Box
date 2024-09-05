import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

interface signupType{
    username  : string,
    email : string,
    password : string,
}

export default function Signup() {
    const navigate = useNavigate();
    const [image,setImage] = useState<File | string>("");
    const [authData,setAuthData] = useState<signupType>({
        username : "",
        email : "",
        password : "",
    })

    const fileChangeHandler = (e : any) => {
        setImage(e.target.files[0]);
    }

    const onChangeHandler = (e: any) => {
        var name = e.target.name;
        var value = e.target.value;

        setAuthData({...authData,[name] : value});
    }

    const handleSignup = async (e : any) => {
        e.preventDefault();
        try{
            const formData = new FormData();
            formData.append("username",authData.username);
            formData.append("email",authData.email);
            formData.append("password",authData.password);
            formData.append("image",image)

            const res = await axios.post("http://localhost:3000/api/auth/signup",formData);
            if(res.data.success){
                localStorage.setItem("token",res.data.token);
                toast.success(res.data.message,{
                    position : "top-right"
                })
                setAuthData({
                    username : "",
                    email : "",
                    password : ""
                })
                setImage("");
                navigate("/");
            }else{
                toast.error(res.data.message,{
                    position : "top-right"
                })
            }
        }
        catch(err){
            console.log(err)
        }
    }

  return (
    <div className="h-screen w-full flex justify-center items-center bg-[#d0d4dd]">
        <div className="border w-[400px] px-5 shadow-md py-3 bg-white rounded-md">
            <h1 className="px-1 py-4 text-md text-center">Welcome to Chat Application</h1>
            <form onSubmit={handleSignup}>
                <div className="flex flex-col gap-1">
                    <label htmlFor="username" >Username:</label>
                    <input type="text" name="username" className="outline-blue-600 py-1 px-2 mb-3 bg-[#f0f1f5] rounded-md" required placeholder="Enter your username" onChange={onChangeHandler} />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" placeholder="Enter your password" required className="bg-[#f0f1f5] rounded-md outline-blue-600 py-1 px-2 mb-3" onChange={onChangeHandler} />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" placeholder="Enter your password" required className="bg-[#f0f1f5] rounded-md outline-blue-600 py-1 px-2 mb-3" onChange={onChangeHandler} />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="image">Upload your picture:</label>
                    <input type="file" name="image" placeholder="Enter your password" className="cursor-pointer text-sm bg-[#f0f1f5] rounded-md outline-blue-600 py-1 px-2 mb-3" onChange={fileChangeHandler}  />
                </div>
                <div className="flex justify-center items-center">
                    <button type="submit" className="bg-blue-600 w-[350px] my-3 text-sm rounded-md py-2 text-white hover:text-black">Submit</button>
                </div>
            </form>
            <p className="text-md text-center py-2">Already have an account?<span className="underline px-1 hover:text-blue-700 cursor-pointer" onClick={() => navigate("/signin")}>Login</span></p>
        </div>
    </div>
  )
}
