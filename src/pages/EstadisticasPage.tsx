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
  Line,
  ComposedChart,
  Legend,
} from "recharts";

const distritosRaw = [
  { name: "Cayma", consumo_kwh: 4602873.1, usuarios: 43424  },           // ~34.3
  { name: "Miraflores", consumo_kwh: 3040109.1, usuarios: 88375  },      // ~34.4
  { name: "Yanahuara", consumo_kwh: 2519644.37, usuarios: 64738  },       // ~38.9
  { name: "José Luis Bustamante y Rivero", consumo_kwh: 4785295.71, usuarios: 144140  }, // ~33.2
  { name: "Cerro Colorado", consumo_kwh: 16937583.59, usuarios: 491225  },  // ~34.5
  { name: "Alto Selva Alegre", consumo_kwh: 3041680.87, usuarios: 80678   }, // ~37.7
  { name: "Paucarpata", consumo_kwh: 5382241.17, usuarios: 131207  },      // 🚨 ~41.0
  { name: "Mariano Melgar", consumo_kwh: 2243231.77, usuarios: 61970  },  // ~36.2
  { name: "Hunter", consumo_kwh: 1913366.04, usuarios: 55154  },          // ~34.7
  { name: "Socabaya", consumo_kwh: 2953560.43, usuarios: 85615  },        // ~34.5
  { name: "Tiabaya", consumo_kwh: 637414.73, usuarios: 13139  },          // 🚨 ~48.5
  { name: "Characato", consumo_kwh: 591110.35, usuarios: 12338  },        // 🚨 ~47.9
  { name: "Sachaca", consumo_kwh: 2748329.5300000003, usuarios: 71485  },          // ~38.4
  { name: "Chiguata", consumo_kwh: 259105.66, usuarios: 5263  },         // 🚨 ~49.2
  { name: "Jacobo Hunter", consumo_kwh: 88303.9, usuarios: 2768  },   // ~31.9
  { name: "Mollebaya", consumo_kwh: 399396.94, usuarios: 7816  },         // 🚨 ~51.1
  { name: "Sabandía", consumo_kwh: 332429.4, usuarios: 7273  },         // 🚨 ~45.7
  { name: "Quequeña", consumo_kwh: 107282.25, usuarios: 1976  },          // 🚨 ~54.3
  { name: "Uchumayo", consumo_kwh: 561488.72, usuarios: 14941  },         // ~37.6
  { name: "Yura", consumo_kwh: 1045877.94, usuarios: 17432  },            // 🚨 ~60.0
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
