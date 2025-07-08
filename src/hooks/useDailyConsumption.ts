import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import dayjs from "dayjs";

interface RawHourlyRecord {
  id: string;
  datetime: string;
  estimated_consumption: number;
  user_id: string;
  is_active: boolean;
}

interface ProcessedHourlyRecord {
  hour: string;
  total_kwh: number;
}

export function useDailyConsumption(userId: string) {
  return useQuery<ProcessedHourlyRecord[]>({
    queryKey: ["daily-consumption", userId],
    queryFn: async () => {
      const today = dayjs().format("YYYY-MM-DD");
      const res = await api.get<RawHourlyRecord[]>(
        `/hourly-consumptions/user/${userId}?date=${today}`
      );

      // Crear horas del día (00 a 23)
      const hours = Array.from({ length: 24 }, (_, i) =>
        i.toString().padStart(2, "0") + ":00"
      );

      // Inicializar mapa por hora
      const grouped: Record<string, number> = {};
      hours.forEach((h) => (grouped[h] = 0));

      // Procesar datos
      for (const item of res.data) {
        const hour = dayjs(item.datetime).format("HH:00");
        if (grouped.hasOwnProperty(hour)) {
          grouped[hour] += item.estimated_consumption;
        }
      }

      // Convertir a array
      const processed: ProcessedHourlyRecord[] = hours.map((h) => ({
        hour: h,
        total_kwh: parseFloat(grouped[h].toFixed(2)),
      }));

      return processed;
    },
    refetchInterval: 300000, // Refrescar cada 5 minutos
  });
}