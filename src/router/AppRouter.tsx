import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Calculator from "../pages/Calculator";
import MonthlyConsumptions from "../pages/MonthlyConsumptions";
import PrivateRoute from "./PrivateRoute";

function AppRouter() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

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
