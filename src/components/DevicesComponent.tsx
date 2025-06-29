import { useState } from "react";

interface Device {
  id: number;
  name: string;
  description: string;
  image: string;
}

interface DevicesProps {
  onAddDevice: (device: { id: number; name: string; hours: number }) => void;
}

const sampleDevices: Device[] = [
  {
    id: 1,
    name: "Refrigerador",
    description: "Mantiene tus alimentos frescos todo el día.",
    image: "https://cdn-icons-png.flaticon.com/512/1046/1046869.png",
  },
  {
    id: 2,
    name: "Lavadora",
    description: "Lava tu ropa eficientemente.",
    image: "https://cdn-icons-png.flaticon.com/512/1046/1046908.png",
  },
  {
    id: 3,
    name: "Televisor",
    description: "Entretenimiento en alta definición.",
    image: "https://cdn-icons-png.flaticon.com/512/1680/1680920.png",
  },
  {
    id: 4,
    name: "Computadora",
    description: "Para trabajo y ocio.",
    image: "https://cdn-icons-png.flaticon.com/512/2292/2292140.png",
  },
];

const DevicesComponent: React.FC<DevicesProps> = ({ onAddDevice }) => {
  const [usageHours, setUsageHours] = useState<{ [id: number]: string }>({});

  const handleHoursChange = (id: number, value: string) => {
    setUsageHours((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {sampleDevices.map((device) => (
        <div
          key={device.id}
          className="bg-white shadow-md rounded-lg p-4 flex flex-col justify-between relative"
        >
          <img
            src={device.image}
            alt={device.name}
            className="h-32 w-auto mx-auto mb-4"
          />
          <h3 className="text-lg font-semibold text-center">{device.name}</h3>
          <p className="text-sm text-gray-500 text-center mb-4">
            {device.description}
          </p>
          <input
            type="number"
            min="0"
            placeholder="Horas al día"
            value={usageHours[device.id] ?? ""}
            onChange={(e) => handleHoursChange(device.id, e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-center focus:outline-none focus:ring-2 focus:ring-[#005766] mt-auto mb-2"
          />
          <button
            onClick={() => {
              const hours = Number(usageHours[device.id] ?? 0);
              if (hours > 0) {
                onAddDevice({ id: device.id, name: device.name, hours });
              }
            }}
            className="w-full flex items-center justify-center bg-[#005766] text-white rounded-md py-2 hover:bg-[#00434f] transition"
          >
            Añadir
          </button>
        </div>
      ))}
    </div>
  );
};

export default DevicesComponent;
