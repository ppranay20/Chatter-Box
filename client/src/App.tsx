import { Route, Routes } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home></Home>} ></Route>
        <Route path="/signin" element={<Signin></Signin>} ></Route>
        <Route path="/signup" element={<Signup></Signup>} ></Route>
      </Routes>
      <ToastContainer />
    </div>
  )
}
