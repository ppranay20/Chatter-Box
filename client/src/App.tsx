import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";
import './App.css';
import { useContext } from "react";
import UserProfile from "./components/UserProfile";
import { ChatContext } from "./context/chatProvider";
import SideDrawer from "./components/SideDrawer";
import GroupChat from "./components/GroupChat";
import SenderProfile from "./components/SenderProfile";
import GroupModal from "./components/GroupModal";

export default function App() {

  const chatContext = useContext(ChatContext);

    if(!chatContext){
        return null;
    }

    const {showUserProfile,isSideDrawerOpen,newGroupChat,showSendersProfile,showGroupModal} = chatContext;

  return (
    <div>
        { showUserProfile && <UserProfile></UserProfile>}
        { isSideDrawerOpen && <SideDrawer />}
        { newGroupChat && <GroupChat></GroupChat>}
        { showSendersProfile && <SenderProfile></SenderProfile>}
        { showGroupModal && <GroupModal></GroupModal>}
      <div className="bg-pink-400 h-screen">
        <Routes>
          <Route path="/" element={<Home></Home>} ></Route>
          <Route path="/signin" element={<Signin></Signin>} ></Route>
          <Route path="/signup" element={<Signup></Signup>} ></Route>
        </Routes>
        <ToastContainer />
      </div>
    </div>
  )
}
