import MyChats from "../components/MyChats";
import ChatBox from "../components/ChatBox";
import Navbar from "../components/Navbar";

export default function Home() {

  return (
    <div>
      <Navbar></Navbar>
      <div className="w-[1350px] flex gap-8 my-4 mx-auto">
        <MyChats></MyChats>
        <ChatBox></ChatBox>
      </div>
    </div>
  )
}
