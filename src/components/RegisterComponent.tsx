import { Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useRegisterUser } from "../hooks/useRegisterUser";
import { useDistricts } from "../hooks/useDistricts";
import ErrorAlert from "../components/ErrorAlert";

function RegisterComponent() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const registerMutation = useRegisterUser();
  const { data: districts} = useDistricts();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    repeatPassword: "",
    district_id: 1,
    username: "",
    taste: ["tech", "sports", "reading"],
    is_active: true,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.repeatPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }
    
    formData.district_id=Number(formData.district_id);
    
    registerMutation.mutate({
      ...formData,
      // Elimina campo repeatPassword antes de enviar
      repeatPassword: undefined,
    } as any);
  };

  return (
    <section
      className="min-h-screen bg-[#05222d] flex items-center justify-center py-10 px-4"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Formulario */}
        <div className="w-full lg:w-1/2 p-8 md:p-10">
          <div className="text-center mb-6">
            <img
              src="https://cdn-icons-png.flaticon.com/512/1429/1429307.png"
              alt="logo"
              className="w-20 mx-auto mb-3"
            />
            <h4 className="text-xl font-semibold">
              Crea tu cuenta en Light for Life
            </h4>
          </div>

          <form onSubmit={handleSubmit}>
            <p className="text-gray-700 mb-4">
              Completa tus datos para registrarte
            </p>

            <div className="mb-4">
              <input
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Nombre"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005766]"
              />
            </div>

            <div className="mb-4">
              <input
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Apellido"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005766]"
              />
            </div>

            <div className="mb-4">
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Correo electrónico"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005766]"
              />
            </div>

            <div className="mb-4">
              <input
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Usuario"
                className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005766]"
              />
            </div>

            <div className="mb-4">
              <select
                name="district_id"
                value={formData.district_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#005766]"
              >
                <option value="" disabled>
                  Selecciona tu distrito
                </option>
                {districts?.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4 relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
                className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#005766]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="mb-6 relative">
              <input
                type={showRepeatPassword ? "text" : "password"}
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                placeholder="Repetir contraseña"
                className="w-full border border-gray-300 rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#005766]"
              />
              <button
                type="button"
                onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                tabIndex={-1}
              >
                {showRepeatPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-center mb-4">
              <button
                type="submit"
                className="w-full bg-[#005766] text-white rounded-md py-2 hover:bg-[#00434f] transition select-none cursor-pointer" 
              >
                Crear cuenta
              </button>
            </div>

            <div className="flex items-center justify-center text-sm">
              <p className="mr-2">¿Ya tienes una cuenta?</p>
              <Link
                to="/login"
                className="text-[#dc2626] font-medium hover:underline"
              >
                Iniciar sesión
              </Link>
            </div>
            {registerMutation.isPending && <p>Registrando...</p>}
            {registerMutation.isSuccess && <p>¡Registro exitoso!</p>}
            {registerMutation.isError && (
              <ErrorAlert
                message={
                  (registerMutation.error as any)?.response?.data?.message ||
                  "Ha ocurrido un error. Intenta nuevamente."
                }
              />
            )}
          </form>
        </div>

        {/* Imagen lateral */}
        <div
          className="
            hidden lg:flex w-1/2
            bg-gradient-to-r from-[#005766] via-[#0090aa] to-[#0096aa]
            items-center justify-center text-white p-8
          "
        >
          <div className="max-w-md">
            <h4 className="text-2xl font-semibold mb-4">
              Únete a Light for Life
            </h4>
            <p className="text-sm leading-relaxed">
              Empieza a monitorear tu consumo eléctrico, recibe reportes
              personalizados y toma el control de tu energía.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegisterComponent;
