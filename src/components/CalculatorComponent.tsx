import React from "react";

interface DeviceUsage {
  id: number;
  name: string;
  hours: number;
}

interface CalculatorProps {
  usageList: DeviceUsage[];
}

const CalculatorComponent: React.FC<CalculatorProps> = ({ usageList }) => {
  // Suma de horas
  const totalHours = usageList.reduce((sum, device) => sum + device.hours, 0);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-2xl mx-auto mt-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Resumen de consumo diario
      </h2>

      {usageList.length === 0 ? (
        <p className="text-gray-500">No has añadido dispositivos aún.</p>
      ) : (
        <ul className="divide-y divide-gray-200 mb-4">
          {usageList.map((device) => (
            <li
              key={device.id}
              className="py-3 flex justify-between items-center"
            >
              <span className="text-gray-700">{device.name}</span>
              <span className="text-gray-600">{device.hours} horas/día</span>
            </li>
          ))}
        </ul>
      )}

      <div className="border-t pt-4 flex justify-between items-center">
        <span className="font-semibold text-gray-800">Consumo total</span>
        <span className="text-lg font-bold text-[#005766]">
          {totalHours} hrs
        </span>
      </div>
    </div>
  );
};

export default CalculatorComponent;
