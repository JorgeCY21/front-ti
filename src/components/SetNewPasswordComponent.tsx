import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function SetNewPasswordComponent() {
  const { state } = useLocation() as { state: { code: string } };
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== repeatPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await axios.post("http://localhost:3000/api/users/set-new-password", {
        code: state.code,
        password,
      });

      navigate("/login");
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          "Ocurrió un error. Intenta nuevamente."
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
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">
          Nueva contraseña
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="password"
              placeholder="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005766]"
              required
            />
          </div>
          <div className="mb-6">
            <input
              type="password"
              placeholder="Repetir contraseña"
              value={repeatPassword}
              onChange={(e) => setRepeatPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005766]"
              required
            />
          </div>
          {error && (
            <p className="text-red-600 text-center mb-4">{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#005766] text-white rounded-md py-2 hover:bg-[#00434f] transition disabled:opacity-50"
          >
            {loading ? "Actualizando..." : "Establecer contraseña"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default SetNewPasswordComponent;

