import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Calculator from "../pages/Calculator";
import MonthlyConsumptions from "../pages/MonthlyConsumptions";
import PrivateRoute from "./PrivateRoute";
import ResetPasswordComponent from "../components/ResetPasswordComponent";
import VerifyCodeComponent from "../components/VerifyCodeComponent";
import SetNewPasswordComponent from "../components/SetNewPasswordComponent";

function AppRouter() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login/forgot-password" element={<ResetPasswordComponent/>}/>
      <Route path="/verify-code" element={<VerifyCodeComponent/>}/>
      <Route path="/reset-password" element={<SetNewPasswordComponent/>}/>


      {/* Protegidas */}
      <Route
        path="/consumoDiario"
        element={
          <PrivateRoute>
            <Calculator />
          </PrivateRoute>
        }
      />
      <Route
        path="/consumoMensual"
        element={
          <PrivateRoute>
            <MonthlyConsumptions />
          </PrivateRoute>
        }
      />

      {/* Redirección por defecto */}
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRouter;
