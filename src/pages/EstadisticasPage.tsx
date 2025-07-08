import { useState } from "react";
import Navbar from "../components/Navbar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  ComposedChart,
  Legend,
} from "recharts";

const distritosRaw = [
  { name: "Cayma", consumo_kwh: 15800, usuarios: 460 },           // ~34.3
  { name: "Miraflores", consumo_kwh: 14100, usuarios: 410 },      // ~34.4
  { name: "Yanahuara", consumo_kwh: 12050, usuarios: 310 },       // ~38.9
  { name: "José Luis Bustamante y Rivero", consumo_kwh: 18300, usuarios: 550 }, // ~33.2
  { name: "Cerro Colorado", consumo_kwh: 16900, usuarios: 490 },  // ~34.5
  { name: "Alto Selva Alegre", consumo_kwh: 11300, usuarios: 300 }, // ~37.7
  { name: "Paucarpata", consumo_kwh: 16000, usuarios: 390 },      // 🚨 ~41.0
  { name: "Mariano Melgar", consumo_kwh: 13400, usuarios: 370 },  // ~36.2
  { name: "Hunter", consumo_kwh: 11800, usuarios: 340 },          // ~34.7
  { name: "Socabaya", consumo_kwh: 14500, usuarios: 420 },        // ~34.5
  { name: "Tiabaya", consumo_kwh: 9700, usuarios: 200 },          // 🚨 ~48.5
  { name: "Characato", consumo_kwh: 9100, usuarios: 190 },        // 🚨 ~47.9
  { name: "Sachaca", consumo_kwh: 9600, usuarios: 250 },          // ~38.4
  { name: "Chiguata", consumo_kwh: 5900, usuarios: 120 },         // 🚨 ~49.2
  { name: "Jacobo Hunter", consumo_kwh: 10200, usuarios: 320 },   // ~31.9
  { name: "Mollebaya", consumo_kwh: 4600, usuarios: 90 },         // 🚨 ~51.1
  { name: "Sabandía", consumo_kwh: 6400, usuarios: 140 },         // 🚨 ~45.7
  { name: "Quequeña", consumo_kwh: 3800, usuarios: 70 },          // 🚨 ~54.3
  { name: "Uchumayo", consumo_kwh: 7900, usuarios: 210 },         // ~37.6
  { name: "Yura", consumo_kwh: 10800, usuarios: 180 },            // 🚨 ~60.0
];

// Agregamos consumo promedio por usuario a cada distrito
const distritosData = distritosRaw.map((d) => ({
  ...d,
  promedio_kwh: +(d.consumo_kwh / d.usuarios).toFixed(2),
}));

function EstadisticasPage() {
  const [modo, setModo] = useState<"solo_total" | "combinado">("combinado");

  const dataOrdenada = [...distritosData].sort(
    (a, b) => b.consumo_kwh - a.consumo_kwh
  );

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-4">
          Consumo de Energía por Distrito - Arequipa
        </h1>

        <p className="text-center text-gray-600 mb-6">
          Visualiza el consumo total (kWh) y el consumo promedio por usuario en cada distrito.
        </p>

        {/* Selector de modo */}
        <div className="mb-6 text-center">
          <label className="mr-2 font-medium">Modo de visualización:</label>
          <select
            value={modo}
            onChange={(e) => setModo(e.target.value as any)}
            className="border px-3 py-1 rounded"
          >
            <option value="solo_total">Solo consumo total</option>
            <option value="combinado">Consumo total + promedio por usuario</option>
          </select>
        </div>

        {/* Gráfica */}
        <ResponsiveContainer width="100%" height={500}>
          {modo === "solo_total" ? (
            <BarChart
              data={dataOrdenada}
              margin={{ top: 10, right: 20, left: 0, bottom: 70 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
                tick={{ fontSize: 11 }}
                />

              <YAxis
                label={{
                  value: "Consumo (kWh)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip formatter={(value: number) => `${value} kWh`} />
              <Bar dataKey="consumo_kwh" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          ) : (
            <ComposedChart
              data={dataOrdenada}
              margin={{ top: 10, right: 20, left: 10, bottom: 90 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                interval={0}
                height={100}
              />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Consumo Total (kWh)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Promedio por usuario (kWh)",
                  angle: 90,
                  position: "insideRight",
                }}
              />
              <Tooltip />
              <Legend wrapperStyle={{ marginTop: 20 }} />
              <Bar
                yAxisId="left"
                dataKey="consumo_kwh"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
                name="Total kWh"
              />
              <Line
                yAxisId="right"
                dataKey="promedio_kwh"
                stroke="#10b981"
                strokeWidth={2}
                name="Promedio por usuario"
                dot={({ cx, cy, payload }) => {
                    const color = payload.promedio_kwh > 40 ? "#ef4444" : "#10b981"; // rojo o verde
                    return (
                    <circle
                        cx={cx}
                        cy={cy}
                        r={5}
                        fill={color}
                        stroke="#ffffff"
                        strokeWidth={1}
                    />
                    );
                }}
                activeDot={{ r: 7 }}
                />
                

            </ComposedChart>
          )}
          
        </ResponsiveContainer>
        
      </div>
    </div>
  );
}

export default EstadisticasPage;
