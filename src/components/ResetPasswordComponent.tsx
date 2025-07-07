import logo from "../../public/logo_ll.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPasswordComponent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post("http://localhost:3000/api/users/create-reset-password", {
        email,
      });

      // Redirigir a la página de verificación y pasar el email
      navigate("/verify-code", { state: { email } });
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message || "Ocurrió un error. Intenta nuevamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="min-h-screen bg-[#05222d] flex items-center justify-center py-10 px-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="w-full max-w-md bg-[#111827] rounded-lg shadow-lg p-8 text-center">
        <img
          src={logo}
          alt="logo"
          className="w-16 mx-auto mb-4"
        />
        <h2 className="text-2xl font-semibold text-white mb-2">
          Restablecer contraseña
        </h2>
        <p className="text-gray-400 mb-6 text-sm">
          Ingresa tu correo para recibir el código de recuperación.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="email"
              required
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-600 rounded-md px-4 py-2 bg-[#1f2937] text-white focus:outline-none focus:ring-2 focus:ring-[#005766]"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#005766] text-white font-semibold py-2 rounded hover:bg-[#00434f] transition"
          >
            {loading ? "Enviando..." : "Enviar enlace de recuperación"}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-red-500 text-sm">{error}</p>
        )}

        <div className="mt-4 text-sm">
          <Link
            to="/login"
            className="text-[#00d1d1] hover:underline"
          >
            Volver al inicio de sesión
          </Link>
        </div>
      </div>
    </section>
  );
}

export default ResetPasswordComponent;

