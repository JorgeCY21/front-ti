import { useState } from "react";

function SearchComponent() {
  const [query, setQuery] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");

  //EJEMPLOS
  const devices = [
    "Refrigerador",
    "Lavadora",
    "Licuadora",
    "Televisor",
    "Computadora",
    "Microondas",
    "Aire Acondicionado",
  ];

  const handleSearch = () => {
    console.log("Buscando:", { query, selectedDevice });
    // PARA HACER LA FUNCION DE FETCH
  };

  return (
    <section className="max-w-2xl ml-0">
      <div className="bg-white shadow-md rounded-lg p-3 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#005766]"
        />

        <select
          value={selectedDevice}
          onChange={(e) => setSelectedDevice(e.target.value)}
          className="flex-1 border border-gray-300 rounded-md px-3 md:px-4 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-[#005766] "
        >
          <option className="text-xs md:text-base" value="">
            Todos los dispositivos
          </option>
          {devices.map((device, index) => (
            <option className="text-xs md:text-base" key={index} value={device}>
              {device}
            </option>
          ))}
        </select>
        <button
          onClick={handleSearch}
          className="bg-[#005766] text-white rounded-md px-6 py-2 hover:bg-[#00434f] transition whitespace-nowrap"
        >
          Buscar
        </button>
      </div>
    </section>
  );
}

export default SearchComponent;
