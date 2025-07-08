import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Calculator from "../pages/Calculator";
import MonthlyConsumptions from "../pages/MonthlyConsumptions";
import PrivateRoute from "./PrivateRoute";
import VideosPage from "../pages/VideosPage";
import EstadisticasPage from "../pages/EstadisticasPage";
import DashboardPage from "../pages/DashboardPage";
import ForgotPassword from "../pages/RecoverPassword/ForgotPassword";
import VerifyCode from "../pages/RecoverPassword/VerifyCode";
import ResetPassword from "../pages/RecoverPassword/ResetPassword";

function AppRouter() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-reset-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<ResetPassword />} />

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

      <Route 
        path="/videos" 
        element={
          <PrivateRoute>
            <VideosPage />
          </PrivateRoute>
        } 
      />

      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardPage/>
          </PrivateRoute>
        } 
      />

      <Route 
        path="/estadisticas" 
        element={
          <EstadisticasPage />
        } 
      />

      {/* Redirección por defecto */}
      <Route path="/*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default AppRouter;
