import React from "react";
import { useDailyConsumptionsByDate } from "../hooks/useDailyConsumptionByDate";
import { useDevices } from "../hooks/useDevices";
import dayjs from "dayjs";

interface CalculatorProps {
  userId: string;
}

const CalculatorComponent: React.FC<CalculatorProps> = ({ userId }) => {
  const { data: devices } = useDevices();
  const today = dayjs().format("YYYY-MM-DD");

  const { data, isLoading, isError } = useDailyConsumptionsByDate(
    userId,
    today
  );
  const deviceMap = new Map(devices?.map((d) => [d.id, d.name]));

  if (isLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto mt-6">
        <p className="text-center">Cargando consumo...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto mt-6">
        <p className="text-center text-red-500">
          Error al cargar el consumo diario.
        </p>
      </div>
    );
  }

  const totalHours = data?.reduce((sum, d) => sum + d.hours_use, 0) ?? 0;
  const totalConsumption =
    data?.reduce((sum, d) => sum + d.estimated_consumption, 0) ?? 0;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Resumen de consumo dia {today}
      </h2>

      {data?.length === 0 ? (
        <p className="text-gray-500">No has añadido dispositivos aún.</p>
      ) : (
        <table className="w-full text-center mb-4">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-gray-700">Dispositivo</th>
              <th className="py-2 text-gray-700">Horas/día</th>
              <th className="py-2 text-gray-700">Consumo estimado (kWh)</th>
            </tr>
          </thead>
          <tbody>
            {data?.map((device) => (
              <tr key={device.id} className="border-b">
                <td className="py-2">{deviceMap.get(device.device_id)}</td>
                <td className="py-2">{device.hours_use}</td>
                <td className="py-2">{device.estimated_consumption}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div className="border-t pt-4 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">Total de horas</span>
          <span className="text-lg font-bold text-[#005766]">
            {totalHours} hrs
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-semibold text-gray-800">
            Consumo total estimado
          </span>
          <span className="text-lg font-bold text-[#005766]">
            {totalConsumption.toFixed(2)} kWh
          </span>
        </div>
      </div>
    </div>
  );
};

export default CalculatorComponent;
