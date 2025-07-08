import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const requestResetCode = useMutation({
    mutationFn: async () => {
      await api.post("/users/create-reset-password", { email });
    },
    onSuccess: () => {
      setMessage("Código enviado al correo. Verifica tu bandeja.");
      setTimeout(() => {
        navigate("/verify-reset-code", { state: { email } });
      }, 1500);
    },
    onError: () => {
      setMessage("Correo no encontrado.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    requestResetCode.mutate();
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-[#05222d] px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-lg shadow p-8">
        <h2 className="text-xl font-bold text-center mb-4">Recuperar Contraseña</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full border px-4 py-2 rounded mb-4"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={requestResetCode.isPending}
            className="w-full bg-[#005766] text-white py-2 rounded hover:bg-[#00434f] select-none cursor-pointer"
          >
            {requestResetCode.isPending ? "Enviando..." : "Enviar código"}
          </button>
        </form>
        {message && <p className="text-sm text-center mt-4">{message}</p>}
      </div>
    </section>
  );
}

export default ForgotPassword;
