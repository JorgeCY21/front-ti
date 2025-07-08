import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CalendarComponent() {
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // Enero=0
  const navigate = useNavigate();

  const year = 2025;

  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const consumoTotal = 150; // kWh
  const metaTotal = 120; // kWh
  const logrado = consumoTotal <= metaTotal;

  const firstDayOfMonth = new Date(year, selectedMonth, 1);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();

  const calendarDays = [];
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push(d);
  }

  return (
    <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Calendario */}
      <div className="md:col-span-2">
        <div className="flex justify-center mb-4">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#005766]"
          >
            {monthNames.map((name, index) => (
              <option key={index} value={index}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-4">
          {monthNames[selectedMonth]} {year}
        </h2>

        <div className="grid grid-cols-7 gap-2 border border-gray-300 rounded-lg p-2 bg-white shadow">
          {["D", "L", "M", "M", "J", "V", "S"].map((day) => (
            <div
              key={day}
              className="text-center text-sm font-semibold text-gray-600"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`h-16 flex items-center justify-center rounded ${
                day === 1
                  ? "bg-orange-100 border border-orange-400 relative"
                  : "bg-gray-50"
              }`}
            >
              {day === 1 ? (
                <div className="flex flex-col items-center justify-center text-orange-600 font-semibold">
                  <span className="text-xl">🔥</span>
                  <span>{day}</span>
                </div>
              ) : (
                <span className="text-gray-700">{day ?? ""}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resumen + botón */}
      <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-center">
        <h3 className="text-xl font-semibold mb-4 text-center">
          Resumen del Mes
        </h3>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Mes:</span> {monthNames[selectedMonth]}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Año:</span> {year}
        </p>
        <p className="text-gray-700 mb-2">
          <span className="font-medium">Consumo Total:</span> S/. {consumoTotal}
        </p>
        <p className="text-gray-700 mb-4">
          <span className="font-medium">Meta:</span> S/. {metaTotal}
        </p>
        <div
          className={`text-center font-semibold py-2 rounded mb-4 ${
            logrado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {logrado ? "Meta Lograda ✅" : "Meta No Alcanzada"}
        </div>

        {/* Botón para gestionar metas */}
        <button
          onClick={() => navigate("/metas")}
          className="w-full bg-[#005766] text-white font-medium px-4 py-2 rounded hover:bg-[#00434f] transition"
        >
          Ver / Crear Meta de Consumo
        </button>
      </div>
    </div>
  );
}

export default CalendarComponent;
