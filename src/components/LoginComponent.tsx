import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

function LoginComponent(){
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();

  // MUTATION de login
  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post("/users/login", { email, password });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Usuario autenticado:", data);
      // Guarda el usuario en el contexto
      login({
        id: data.id,
        username: data.username,
        email: data.email,
        name: data.user_profile.first_name
        
      });
      navigate("/ConsumoDiario");
    },
    onError: (error: any) => {
      console.error("Error de login:", error);
      alert("Credenciales inválidas");
    },
  });
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <section
      className="min-h-screen bg-[#05222d] flex items-center justify-center py-10 px-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="w-full lg:w-1/2 p-8 md:p-10">
        <Link to="/">
          <div className="text-center mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1429/1429307.png"
              alt="logo"
              className="w-20 mx-auto mb-3"
            />
            <h4 className="text-xl font-semibold">Bienvenido a Light for Life</h4>
          </div>
          </Link>

          <form onSubmit={handleSubmit}>
            <p className="text-gray-700 mb-4">Inicia sesión en tu cuenta</p>

            <div className="mb-4">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005766]"
                required
              />
            </div>

            <div className="mb-6">
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005766]"
                required
              />
            </div>

            <div className="text-center mb-4">
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-[#005766] text-white rounded-md py-2 hover:bg-[#00434f] transition"
              >
                {loginMutation.isPending? "Ingresando..." : "Iniciar sesión"}
              </button>
            </div>

            <div className="text-center mb-6">
              <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <div className="flex items-center justify-center text-sm">
              <p className="mr-2">¿No tienes una cuenta?</p>
              <Link to="/register" className="text-[#dc2626] font-medium hover:underline">
                Crear cuenta
              </Link>
            </div>
          </form>
        </div>
        <div
          className="
            hidden lg:flex w-1/2
            bg-gradient-to-r from-[#005766] via-[#0090aa] to-[#0096aa]
            items-center justify-center text-white p-8
          "
        >
          <div className="max-w-md">
            <h4 className="text-2xl font-semibold mb-4">Más que una app de energía</h4>
            <p className="text-sm leading-relaxed">
              Light for Life te ayuda a monitorear, analizar y reducir tu consumo eléctrico diario para que vivas mejor y ahorres más.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginComponent;

