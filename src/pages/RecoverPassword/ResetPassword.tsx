import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../api/axios";
import { Eye, EyeOff } from "lucide-react"; // 👁️ importamos los iconos

function ResetPassword() {
  const { state } = useLocation();
  const email = state?.email;
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const resetPasswordMutation = useMutation({
    mutationFn: async () => {
      await api.post("/users/reset-password", {
        email,
        newPassword,
      });
    },
    onSuccess: () => {
      alert("Contraseña restablecida correctamente.");
      navigate("/login");
    },
    onError: () => {
      setError("Error al restablecer la contraseña.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setError("");
    resetPasswordMutation.mutate();
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#05222d] px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold text-center mb-4">Nueva Contraseña</h2>
        <form onSubmit={handleSubmit}>

          {/* Campo de nueva contraseña */}
          <div className="relative mb-4">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full border px-4 py-2 rounded pr-10"
              placeholder="Nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* Campo de confirmar contraseña */}
          <div className="relative mb-4">
            <input
              type={showConfirm ? "text" : "password"}
              className="w-full border px-4 py-2 rounded pr-10"
              placeholder="Confirmar nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500"
              onClick={() => setShowConfirm(!showConfirm)}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={resetPasswordMutation.isPending}
            className="w-full bg-[#005766] text-white py-2 rounded hover:bg-[#00434f] select-none cursor-pointer"
          >
            {resetPasswordMutation.isPending ? "Guardando..." : "Guardar nueva contraseña"}
          </button>
        </form>
        {error && <p className="text-sm text-red-500 text-center mt-2">{error}</p>}
      </div>
    </section>
  );
}

export default ResetPassword;
