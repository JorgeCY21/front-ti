import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home"
import Login from "../pages/Login";
import Register from "../pages/Register"
import Calculator from "../pages/Calculator";
import MonthlyConsumptions from "../pages/MonthlyConsumptions";

function AppRouter() {
  return (
    <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/*" element={<Navigate to="/"/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/consumoDiario" element={<Calculator/>}/>
        <Route path="/consumoMensual" element={<MonthlyConsumptions/>}/>
    </Routes>
  );
};

export default AppRouter;