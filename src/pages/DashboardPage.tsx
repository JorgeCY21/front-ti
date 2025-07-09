import { useState } from "react";
import { useWeeklyConsumption } from "../hooks/useWeeklyConsumption";
import { useDailyConsumption } from "../hooks/useDailyConsumption";
import { useBiweeklyConsumption } from "../hooks/useBiweeklyConsumption";
import { useMonthlyConsumption } from "../hooks/useMonthlyConsumption";
import Navbar from "../components/Navbar";
import { useAuth } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
} from "recharts";
import { format, subDays, subMonths } from "date-fns";
import { es } from "date-fns/locale";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

// Definición de tipos
interface ProcessedHourlyRecord {
  hour: string;
  total_kwh: number;
}

interface ProcessedDailyRecord {
  date: string;
  total_kwh: number;
}

type ConsumptionRecord = ProcessedHourlyRecord | ProcessedDailyRecord;

// Type guard para verificar si es un registro horario
function isHourlyRecord(record: ConsumptionRecord): record is ProcessedHourlyRecord {
  return 'hour' in record;
}

function DashboardPage() {
  const { user } = useAuth();
  const userId = user?.id;
  const [timeRange, setTimeRange] = useState<"daily" | "weekly" | "biweekly" | "monthly">("weekly");

  if (!userId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <Navbar />
        <div className="max-w-4xl mx-auto px-6 py-10">
          <p className="text-center text-gray-600">
            Inicia sesión para ver tu dashboard.
          </p>
        </div>
      </div>
    );
  }

  // Datos para diferentes rangos de tiempo
  const { data: weeklyData, isLoading: weeklyLoading, isError: weeklyError } = useWeeklyConsumption(userId);
  const { data: dailyData, isLoading: dailyLoading, isError: dailyError } = useDailyConsumption(userId);
  const { data: biweeklyData, isLoading: biweeklyLoading, isError: biweeklyError } = useBiweeklyConsumption(userId);
  const { data: monthlyData, isLoading: monthlyLoading, isError: monthlyError } = useMonthlyConsumption(userId);

  // Función para obtener datos según el rango seleccionado
  const getDataForRange = (): ConsumptionRecord[] => {
    switch (timeRange) {
      case "daily":
        return (dailyData as ProcessedHourlyRecord[]) || [];
      case "weekly":
        return (weeklyData as ProcessedDailyRecord[]) || [];
      case "biweekly":
        return (biweeklyData as ProcessedDailyRecord[]) || [];
      case "monthly":
        return (monthlyData as ProcessedDailyRecord[]) || [];
      default:
        return (weeklyData as ProcessedDailyRecord[]) || [];
    }
  };

  const currentData = getDataForRange();
  const total = currentData?.reduce((acc, d) => acc + d.total_kwh, 0) ?? 0;

  // Formatear fechas según el rango
  const formatDateLabel = (record: ConsumptionRecord) => {
    if (isHourlyRecord(record)) {
      return `${record.hour}h`;
    }
    const date = new Date(record.date);
    if (timeRange === "monthly") {
      return format(date, "MMM yyyy", { locale: es });
    }
    return format(date, "d MMM", { locale: es });
  };

  // Calcular comparación con el período anterior
  const getComparisonData = () => {
    if (!currentData || currentData.length === 0) return null;
    
    let previousPeriodData: ConsumptionRecord[] | null = null;
    
    if (timeRange === "weekly") {
      const firstDate = isHourlyRecord(currentData[0]) ? new Date() : new Date(currentData[0].date);
      previousPeriodData = weeklyData ? 
        Array.from({length: 7}, (_, i) => 
          (weeklyData as ProcessedDailyRecord[]).find(item => 
            item.date === format(subDays(firstDate, 7 + i), "yyyy-MM-dd"))
        ).filter(Boolean) as ProcessedDailyRecord[] : null;
    } 
    else if (timeRange === "biweekly") {
      previousPeriodData = biweeklyData ? 
        (biweeklyData as ProcessedDailyRecord[]).slice(0, 15).filter((_, i) => i >= 15) : null;
    }
    else if (timeRange === "monthly") {
      const firstDate = isHourlyRecord(currentData[0]) ? new Date() : new Date(currentData[0].date);
      previousPeriodData = monthlyData ? 
        [(monthlyData as ProcessedDailyRecord[]).find(item => 
          item.date === format(subMonths(firstDate, 1), "yyyy-MM-01"))].filter(Boolean) as ProcessedDailyRecord[] : null;
    }
      
    if (!previousPeriodData || previousPeriodData.length === 0) return null;
    
    const previousTotal = previousPeriodData.reduce((acc: number, d: ConsumptionRecord) => acc + d.total_kwh, 0);
    const difference = total - previousTotal;
    const percentage = previousTotal > 0 ? (difference / previousTotal) * 100 : 0;
    
    return {
      difference,
      percentage,
      isIncrease: difference > 0
    };
  };

  const comparison = getComparisonData();

  // Función para obtener la fecha del registro
  const getRecordDate = (record: ConsumptionRecord): string => {
    return isHourlyRecord(record) ? new Date().toISOString().split('T')[0] : record.date;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Consumo</h1>
            <p className="text-gray-500 mt-1">
              Visualiza tu historial de consumo eléctrico
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 bg-white rounded-lg shadow-sm p-1">
            <div className="flex space-x-1">

              <button
                onClick={() => setTimeRange("weekly")}
                className={`px-3 py-1 text-sm rounded-md select-none cursor-pointer transition-all ${timeRange === "weekly" ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Semanal
              </button>
              <button
                onClick={() => setTimeRange("biweekly")}
                className={`px-3 py-1 text-sm rounded-md select-none cursor-pointer transition-all ${timeRange === "biweekly" ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
              >
                15 días
              </button>
              <button
                onClick={() => setTimeRange("monthly")}
                className={`px-3 py-1 text-sm rounded-md select-none cursor-pointer transition-all ${timeRange === "monthly" ? "bg-blue-100 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-100"}`}
              >
                Mensual
              </button>
            </div>
          </div>
        </div>

        {currentData && currentData.length > 0 && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-500 mb-1">Consumo total</h3>
                <p className="text-3xl font-bold text-gray-900 mb-2">{total.toFixed(2)} kWh</p>
                {comparison && (
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-sm ${comparison.isIncrease ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                    {comparison.isIncrease ? (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                    {Math.abs(comparison.percentage).toFixed(1)}% {comparison.isIncrease ? "más" : "menos"} que el período anterior
                  </div>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-500 mb-1">Período</h3>
                <p className="text-xl font-semibold text-gray-900">
                  {timeRange === "daily" ? 
                    format(new Date(), "EEEE, d 'de' MMMM", { locale: es }) :
                    `${format(new Date(getRecordDate(currentData[currentData.length - 1])), "d 'de' MMMM", { locale: es })} - ${format(new Date(getRecordDate(currentData[0])), timeRange === "monthly" ? "MMMM yyyy" : "d 'de' MMMM yyyy", { locale: es })}`}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {timeRange === "daily" ? "Consumo de hoy" : 
                   timeRange === "weekly" ? "Últimos 7 días" :
                   timeRange === "biweekly" ? "Últimos 15 días" : "Último mes"}
                </p>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-medium text-gray-500 mb-1">Promedio diario</h3>
                <p className="text-3xl font-bold text-gray-900">
                  {timeRange === "monthly" ? 
                    (total / 30).toFixed(2) : 
                    (total / currentData.length).toFixed(2)} kWh
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {timeRange === "monthly" ? "Basado en 30 días" : `Basado en ${currentData.length} ${timeRange === "daily" ? "horas" : "días"}`}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {timeRange === "daily" ? "Consumo por horas" : 
                   timeRange === "weekly" ? "Consumo de los últimos 7 días" :
                   timeRange === "biweekly" ? "Consumo de los últimos 15 días" : "Consumo mensual"}
                </h2>
                <div className="text-sm text-gray-500">
                  {total.toFixed(2)} kWh totales
                </div>
              </div>
              
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[...currentData].reverse()}
                    margin={{ top: 20, right: 20, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis 
                      dataKey={timeRange === "daily" ? "hour" : "date"} 
                      tickFormatter={(value, index) => {
                        const record = [...currentData].reverse()[index];
                        return formatDateLabel(record);
                      }}
                      angle={-45}
                      textAnchor="end"
                      height={60}
                      tick={{ fontSize: 12 }}
                    />
                    <YAxis
                      label={{
                        value: "kWh",
                        angle: -90,
                        position: "insideLeft",
                        style: { textAnchor: "middle" },
                      }}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number) => [`${value} kWh`, "Consumo"]}
                      labelFormatter={(value, payload) => {
                        if (!payload || payload.length === 0) return value;
                        const record = payload[0].payload as ConsumptionRecord;
                        return formatDateLabel(record);
                      }}
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        borderColor: "#e5e7eb",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="total_kwh"
                      name="Consumo eléctrico"
                      radius={[4, 4, 0, 0]}
                    >
                      {currentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Día de mayor consumo</h3>
                {currentData.length > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.max(...currentData.map(d => d.total_kwh)).toFixed(2)} kWh
                        </p>
                        <p className="text-gray-500">
                          {timeRange === "daily" ? 
                            "Hora " + (currentData.find(d => d.total_kwh === Math.max(...currentData.map(d => d.total_kwh))) as ProcessedHourlyRecord)?.hour :
                            format(new Date((currentData.find(d => d.total_kwh === Math.max(...currentData.map(d => d.total_kwh))) as ProcessedDailyRecord)?.date || ""), "EEEE, d 'de' MMMM", { locale: es })}
                        </p>
                      </div>
                      <div className="bg-red-100 text-red-800 p-3 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        {timeRange === "daily" ? "Esta hora" : "Este día"} consumiste un {(
                          (Math.max(...currentData.map(d => d.total_kwh)) / 
                          (total / (timeRange === "monthly" ? 30 : currentData.length)) - 1
                        ) * 100).toFixed(1)}% más que tu promedio.
                      </p>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Día de menor consumo</h3>
                {currentData.length > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-gray-900">
                          {Math.min(...currentData.map(d => d.total_kwh)).toFixed(2)} kWh
                        </p>
                        <p className="text-gray-500">
                          {timeRange === "daily" ? 
                            "Hora " + (currentData.find(d => d.total_kwh === Math.min(...currentData.map(d => d.total_kwh))) as ProcessedHourlyRecord)?.hour :
                            format(new Date((currentData.find(d => d.total_kwh === Math.min(...currentData.map(d => d.total_kwh))) as ProcessedDailyRecord)?.date || ""), "EEEE, d 'de' MMMM", { locale: es })}
                        </p>
                      </div>
                      <div className="bg-green-100 text-green-800 p-3 rounded-full">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-sm text-gray-500">
                        {timeRange === "daily" ? "Esta hora" : "Este día"} consumiste un {(
                          1 - (Math.min(...currentData.map(d => d.total_kwh)) / 
                          (total / (timeRange === "monthly" ? 30 : currentData.length))
                        ) * 100).toFixed(1)}% menos que tu promedio.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;