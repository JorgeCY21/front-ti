import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";
import { useUserMedals } from "../hooks/useUserMedals";
import { useMedals } from "../hooks/useMedals";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const { data: userMedals } = useUserMedals(user?.id || "");
  const { data: allMedals } = useMedals();

  // Obtener la medalla con mayor ID de las que ha ganado el usuario
  const highestMedal = useMemo(() => {
    if (!userMedals || !allMedals) return null;

    const matchedMedals = userMedals
      .filter((um) => um.is_active)
      .map((um) => allMedals.find((m) => m.id === um.melda_id))
      .filter(Boolean) as { id: number; name: string; url_img: string }[];

    return matchedMedals.sort((a, b) => b.id - a.id)[0];
  }, [userMedals, allMedals]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkStyle =
    "flex items-center py-2 px-5 md:py-5 text-white no-underline hover:bg-white hover:text-black hover:rounded-none transition";

  const renderLinks = () => (
    <ul className="flex flex-col md:flex-row md:space-x-0 items-start justify-start text-left w-full">
      {isAuthenticated ? (
        <>
          <li><Link to="/consumoDiario" className={navLinkStyle}>Consumo Diario</Link></li>
          <li><Link to="/consumoMensual" className={navLinkStyle}>Consumo Mensual</Link></li>
          <li><Link to="/estadisticas" className={navLinkStyle}>Estadísticas</Link></li>
          <li><Link to="/videos" className={navLinkStyle}>Videos</Link></li>
          <li><Link to="/dashboard" className={navLinkStyle}>Dashboard</Link></li>
        </>
      ) : (
        <li><Link to="/estadisticas" className={navLinkStyle}>Estadísticas</Link></li>
      )}
    </ul>
  );

  const renderAuthButtons = () => (
    <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2 w-full md:w-auto">
      {isAuthenticated ? (
        <div className="flex items-center md:ml-auto space-x-2">
          <div className="flex items-center gap-3">
            {highestMedal && (
              <img
                src={highestMedal.url_img}
                alt={highestMedal.name}
                title={highestMedal.name}
                className="h-6 w-6 rounded-full object-contain border-2 border-yellow-400 bg-white"
              />
            )}
            <NotificationBell />
            <span className="text-white">Hola, {user?.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="border border-white rounded-md px-2 py-1 hover:bg-white hover:text-gray-800 transition"
          >
            <svg
              className="w-4 h-6 text-white hover:text-gray-800"
              fill="none"
              viewBox="0 0 16 16"
              xmlns="http://www.w3.org/2000/svg"
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
      ) : (
        <>
          <Link to="/login" className="border border-white text-white rounded-md px-3 py-1.5 hover:bg-white hover:text-gray-800 transition text-base text-center">Iniciar Sesión</Link>
          <Link to="/register" className="bg-white text-gray-800 rounded-md px-3 py-1.5 text-base hover:bg-gray-200 transition mt-2 md:mt-0 text-center">Registrarse</Link>
        </>
      )}
    </div>
  );

  return (
    <nav className="shadow-2xs rounded-lg mx-3 my-2 px-3 py-5 md:mx-6 md:px-3 md:py-0 bg-[#28465A] transition-all duration-300 ease-in-out">
      <div className="relative flex flex-wrap md:flex-nowrap items-start md:items-center justify-between md:px-5">
        {/* Logo y menú */}
        <div className="flex items-center w-full md:w-auto">
          <div className="flex items-center text-white font-semibold text-xl">
            <Link to="/" className="flex items-center">
              <img src="/logo_ll.png" alt="LL" className="h-8 mr-2" loading="lazy" />
              Light for Life
            </Link>
          </div>
          <button onClick={() => setMenuOpen(!menuOpen)} className="ml-auto md:hidden text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Enlaces de navegación */}
        <div className={`${menuOpen ? "flex" : "hidden"} flex-col md:flex md:flex-row mt-2 md:mt-0 w-full md:w-auto md:flex-1 md:justify-center`}>
          {renderLinks()}
        </div>

        {/* Botones de sesión */}
        <div className={`${menuOpen ? "block" : "hidden"} w-full mt-4 md:mt-0 md:flex md:w-auto`}>
          {renderAuthButtons()}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
