import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home"
import Login from "../pages/Login";
import Register from "../pages/Register"

function AppRouter() {
  return (
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/*" element={<Navigate to="/"/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
    </Routes>
  );
};

export default AppRouter;