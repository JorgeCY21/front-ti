
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const { user, isAuthenticated, logout } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="
        shadow-2xs
        rounded-lg
        mx-3 my-2 px-3 py-5
        md:mx-6 md:my-2 md:px-3 md:py-0
        bg-[#28465A]
        transition-all duration-300 ease-in-out
      "
    >
      <div className="relative flex flex-wrap md:flex-nowrap items-center justify-between md:py-0 md:px-5">
        {isAuthenticated ? (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 w-full md:w-auto">
              <Link
                to="/"
                className="flex items-center text-white font-semibold text-xl "
              >
                <img
                  src="../../public/logo_ll.png"
                  alt="LL"
                  className="h-8 mr-2"
                />
                Light for Life
              </Link>

              <div
                className={`
              ${menuOpen ? "block" : "hidden"}
              mt-2 md:mt-0 md:flex
            `}
              >
                <ul className="flex flex-col md:flex-row md:space-x-0">
                  <li>
                    <Link
                      to="/ConsumoDiario"
                      className="
                    flex items-center
                    py-2 px-5
                    md:py-5
                    text-white no-underline
                    hover:bg-white hover:text-black hover:rounded-none
                    transition
                  "
                    >
                      Consumo Diario
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/consumoMensual"
                      className="
                    flex items-center
                    py-2 px-5
                    md:py-5
                    text-white no-underline
                    hover:bg-white hover:text-black hover:rounded-none
                    transition
                  "
                    >
                      Consumo Mensual
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/estadisticas"
                      className="
                    flex items-center
                    py-2 px-5
                    md:py-5
                    text-white no-underline
                    hover:bg-white hover:text-black hover:rounded-none
                    transition
                  "
                    >
                      Estadísticas
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div
              className={`
            ${menuOpen ? "block" : "hidden"}
            w-full mt-4 md:mt-0 md:flex md:w-auto
          `}
            >
              <div
                className="
              flex flex-col md:flex-row
              md:items-center
              md:space-x-2
              justify-center md:justify-end
              w-full md:w-auto
            "
              >
                <span className="text-white">Hola, {user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="border border-white rounded-md px-2 py-1 hover:bg-white hover:text-gray-800 transition"
                >
                  <svg
                    className="w-4 h-6 hover:text-gray-800 text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 16 16"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="absolute top-1 right-4 md:hidden text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 w-full md:w-auto">
              <Link
                to="/"
                className="flex items-center text-white font-semibold text-xl "
              >
                <img
                  src="../../public/logo_ll.png"
                  alt="LL"
                  className="h-8 mr-2"
                />
                Light for Life
              </Link>

              <div
                className={`
              ${menuOpen ? "block" : "hidden"}
              mt-2 md:mt-0 md:flex
            `}
              >
                <ul className="flex flex-col md:flex-row md:space-x-0">
                  <li>
                    <Link
                      to="/estadisticas"
                      className="
                    flex items-center
                    py-2 px-5
                    md:py-5
                    text-white no-underline
                    hover:bg-white hover:text-black hover:rounded-none
                    transition
                  "
                    >
                      Estadísticas
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div
              className={`
            ${menuOpen ? "block" : "hidden"}
            w-full mt-4 md:mt-0 md:flex md:w-auto
          `}
            >
              <div
                className="
              flex flex-col md:flex-row
              md:items-center
              md:space-x-2
              justify-center md:justify-end
              w-full md:w-auto
            "
              >
                <Link
                  to="/login"
                  className="border border-white text-white rounded-md px-3 py-1.5 hover:bg-white hover:text-gray-800 transition text-base text-center"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-gray-800 rounded-md px-3 py-1.5 text-base hover:bg-gray-200 transition mt-2 md:mt-0 text-center"
                >
                  Registrarse
                </Link>
              </div>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="absolute top-1 right-4 md:hidden text-white focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
