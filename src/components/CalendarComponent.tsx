import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDailyStreak } from "../hooks/useDailyStreak";
import { useGoalsByUser } from "../hooks/useGoals";
import { useMonthlyKwhFromDaily } from "../hooks/useMonthlyKwhFromDaily";
import { useAuth } from "../context/AuthContext";
import { subDays, format } from "date-fns";

function CalendarComponent() {
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const navigate = useNavigate();
  const { streak, user: userData, isLoading, error } = useDailyStreak();
  const { user } = useAuth();

  const currentYear = new Date().getFullYear();
  const [year] = useState<number>(currentYear);

  
  const { data: metas, isLoading: loadingMetas } = useGoalsByUser(user?.id ?? "");
  const { data: consumoMensual, isLoading: loadingConsumo } = useMonthlyKwhFromDaily(
    user?.id ?? "",
    selectedMonth,
    year
  );
  
  console.log(metas)
  const monthNames = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "July", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];

  const selectedMonthName = monthNames[selectedMonth];

  const metaActual = metas?.find(
    (m) =>
      m.month.toLowerCase() === selectedMonthName.toLowerCase() &&
      m.year === year &&
      m.is_active
  );

  const metaTotal = metaActual?.estimated_cost ?? 0;
  const goalKwh = metaActual?.goal_kwh ?? 0;
  const consumoTotal = consumoMensual?.total_kwh ?? 0;

  const tarifaKwh = userData?.district?.fee_kwh ?? 0
  const costoActual = consumoTotal * tarifaKwh;
  const logrado = costoActual <= metaTotal;

  const firstDayOfMonth = new Date(year, selectedMonth, 1);
  const startDay = firstDayOfMonth.getDay();
  const daysInMonth = new Date(year, selectedMonth + 1, 0).getDate();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getStreakDates = (streakLength: number): Set<string> => {
    const dates = new Set<string>();
    const today = new Date();
    for (let i = 0; i < streakLength; i++) {
      const d = subDays(today, i);
      dates.add(format(d, "yyyy-MM-dd"));
    }
    return dates;
  };

  const streakDates = getStreakDates(streak);

  const isStreakDay = (day: number | null): boolean => {
    if (!day) return false;
    const date = new Date(year, selectedMonth, day);
    return streakDates.has(format(date, "yyyy-MM-dd"));
  };

  if (isLoading || loadingMetas || loadingConsumo)
    return <div className="text-center p-8">Cargando datos de calendario...</div>;

  if (error)
    return <div className="text-center p-8 text-red-500">Error al cargar los datos: {(error as Error).message}</div>;

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
              <option key={index} value={index}>{name}</option>
            ))}
          </select>
        </div>

        <h2 className="text-2xl font-semibold text-center mb-2">
          {monthNames[selectedMonth]} {year}
        </h2>

        <div className="text-center font-medium text-[#005766] mb-2">
          🔥 Racha actual: <span className="font-bold">{streak}</span> días
        </div>

        <div className="grid grid-cols-7 gap-2 border border-gray-300 rounded-lg p-2 bg-white shadow">
          {["D", "L", "M", "M", "J", "V", "S"].map((day, index) => (
            <div key={`${day}-${index}`} className="text-center text-sm font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}

          {calendarDays.map((day, index) => (
            <div
              key={index}
              className={`h-16 flex items-center justify-center rounded text-sm font-medium ${
                isStreakDay(day)
                  ? "bg-yellow-100 border border-yellow-400 text-yellow-800"
                  : "bg-gray-50 text-gray-700"
              }`}
            >
              {isStreakDay(day) ? (
                <div className="flex flex-col items-center">
                  <span className="text-lg">🔥</span>
                  <span>{day}</span>
                </div>
              ) : (
                <span>{day ?? ""}</span>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Resumen */}
      <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-center">
        <h3 className="text-xl font-semibold mb-4 text-center">Resumen del Mes</h3>
        <p className="text-gray-700 mb-2"><span className="font-medium">Mes:</span> {monthNames[selectedMonth]}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Año:</span> {year}</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Consumo Total:</span> {consumoTotal.toFixed(2)} kWh</p>
        <p className="text-gray-700 mb-2"><span className="font-medium">Costo estimado:</span> S/. {costoActual.toFixed(2)}</p>
        <p className="text-gray-700 mb-4"><span className="font-medium">Meta:</span> S/. {metaTotal.toFixed(2)}</p>
        <div
          className={`text-center font-semibold py-2 rounded mb-4 ${
            logrado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          {logrado ? "Meta Lograda ✅" : "Meta No Alcanzada"}
        </div>
        <button
          onClick={() => navigate("/metas")}
          className="w-full bg-[#005766] text-white font-medium px-4 py-2 rounded hover:bg-[#00434f] transition-colors duration-200"
        >
          Ver / Crear Meta de Consumo
        </button>
      </div>
    </div>
  );
}

export default CalendarComponent;
