import { useState, useEffect } from "react";
import { useDevices } from "../hooks/useDevices";
import { useAuth } from "../context/AuthContext";
import { useDailyDevices } from "../hooks/useDailyDevices";
import { useUpdateDailyDevices } from "../hooks/useUpdateDailyDevices";
import { useDailyConsumptionsByDate } from "../hooks/useDailyConsumptionByDate";
import dayjs from "dayjs";
import { useQueryClient } from "@tanstack/react-query";



interface DevicesProps {
  onAddDevice?: (device: { id: string; name: string; hours: number }) => void;
}

const DevicesComponent: React.FC<DevicesProps> = ({ onAddDevice }) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { data: devices, isLoading, isError } = useDevices();
  const registerDevicesMutation = useDailyDevices();
  const updateDevicesMutation = useUpdateDailyDevices();

  // Fecha de hoy en formato YYYY-MM-DD
  const today = dayjs().format("YYYY-MM-DD");

  // Obtén consumos previos
  const { data: dailyConsumptions } = useDailyConsumptionsByDate(
    user?.id!,
    today
  );

  // Estados
  const [hoursUseMap, setHoursUseMap] = useState<{
    [deviceId: string]: string;
  }>({});
  const [dailyConsumptionMap, setDailyConsumptionMap] = useState<{
    [deviceId: string]: string;
  }>({});

  // Cuando carga data previa, rellenar mapas
  useEffect(() => {
    if (dailyConsumptions) {
      const hoursMap: { [deviceId: string]: string } = {};
      const idMap: { [deviceId: string]: string } = {};

      dailyConsumptions.forEach((c) => {
        hoursMap[c.device_id] = String(c.hours_use);
        idMap[c.device_id] = c.id;
      });

      setHoursUseMap(hoursMap);
      setDailyConsumptionMap(idMap);
    }
  }, [dailyConsumptions]);

  const handleChange = (deviceId: string, value: string) => {
    setHoursUseMap((prev) => ({ ...prev, [deviceId]: value }));
  };

  const handleSubmit = (deviceId: string) => {
    const hours = Number(hoursUseMap[deviceId] ?? 0);
    if (hours <= 0) {
      alert("Ingresa un número válido de horas.");
      return;
    }

    const existingConsumptionId = dailyConsumptionMap[deviceId];

    if (existingConsumptionId) {
      updateDevicesMutation.mutate(
        {
          id: existingConsumptionId,
          hours_use: hours,
        },
        {
          onSuccess: () => {
            queryClient.invalidateQueries({
              queryKey: ["dailyConsumptions", user?.id, today],
            });
          },
        }
      );
    } else {
      registerDevicesMutation.mutate(
        {
          user_id: user?.id!,
          device_id: deviceId,
          hours_use: hours,
          is_active: true,
        },
        {
          onSuccess: (data) => {
            const createdId = data.data.id;
            setDailyConsumptionMap((prev) => ({
              ...prev,
              [deviceId]: createdId,
            }));
            // Refrescar el resumen
            queryClient.invalidateQueries({
              queryKey: ["dailyConsumptions", user?.id, today],
            });
          },
        }
      );
    }

    if (onAddDevice && devices) {
      const device = devices.find((d) => d.id === deviceId);
      if (device) {
        onAddDevice({ id: device.id, name: device.name, hours });
      }
    }
  };

  if (isLoading) return <p>Cargando dispositivos...</p>;
  if (isError) return <p>Error al cargar dispositivos</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {devices?.map((device) => (
        <div key={device.id} className="bg-white shadow p-4 rounded">
          <img
            src={device.url}
            alt={device.name}
            className="h-32 w-auto mx-auto"
          />
          <h3 className="text-center font-semibold">{device.name}</h3>
          <p className="text-center text-sm text-gray-500">
            Consumo: {device.consumption_kwh_h} kWh/h
          </p>
          <input
            type="number"
            min="0"
            placeholder="Horas al día"
            value={hoursUseMap[device.id] ?? ""}
            onChange={(e) => handleChange(device.id, e.target.value)}
            className="w-full border mt-2 px-3 py-2 rounded text-center"
          />
          <button
            onClick={() => handleSubmit(device.id)}
            className="w-full bg-[#005766] text-white mt-2 py-2 rounded hover:bg-[#00434f]"
          >
            Guardar
          </button>
        </div>
      ))}
    </div>
  );
};

export default DevicesComponent;
