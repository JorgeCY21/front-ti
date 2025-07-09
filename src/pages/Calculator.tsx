import CalculatorComponent from "../components/CalculatorComponent";
import DevicesComponent from "../components/DevicesComponent";
import Navbar from "../components/Navbar";
import SearchComponent from "../components/SearchComponent";
import { useAuth } from "../context/AuthContext";
import ChatBot from "../components/ChatBot"; // Asegúrate de que el import sea correcto

function Calculator() {
  const { user } = useAuth();

  return (
    <div className="main relative"> {/* Añadido relative para contener el ChatBot posicionado fixed */}
      <Navbar />
      <div className="mx-6 flex flex-wrap">
        <div className="flex flex-wrap w-full md:w-3/5">
          <div className="w-full">
            <SearchComponent />
          </div>
          <div className="w-full mt-3">
            <DevicesComponent />
          </div>
        </div>
        <div className="w-full md:w-2/5">
          <CalculatorComponent userId={user?.id!} />
        </div>
      </div>
      
      {/* ChatBot como componente flotante */}
      <ChatBot />
    </div>
  );
}

export default Calculator;