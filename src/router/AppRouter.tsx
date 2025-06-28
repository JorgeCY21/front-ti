import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home"
import Login from "../pages/Login";

function AppRouter() {
  return (
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/*" element={<Navigate to="/"/>} />
        <Route path="/login" element={<Login/>} />
    </Routes>
  );
};

export default AppRouter;