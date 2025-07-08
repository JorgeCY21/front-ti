import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import dayjs from "dayjs";

interface RawMonthlyRecord {
  id: string;
  date: string;
  estimated_consumption: number;
  user_id: string;
  is_active: boolean;
}

interface ProcessedMonthlyRecord {
  month: string;
  total_kwh: number;
  year: string;
  date: string; // Para mantener compatibilidad con el formato esperado
}

export function useMonthlyConsumption(userId: string) {
  return useQuery<ProcessedMonthlyRecord[]>({
    queryKey: ["monthly-consumption", userId],
    queryFn: async () => {
      const res = await api.get<RawMonthlyRecord[]>(`/monthly-consumptions/user/${userId}`);

      const last12Months = Array.from({ length: 12 }, (_, i) =>
        dayjs().subtract(i, "month")
      ).reverse();

      // Inicializamos un mapa por mes
      const grouped: Record<string, { total: number; year: string }> = {};
      last12Months.forEach((m) => {
        const key = m.format("YYYY-MM");
        grouped[key] = { total: 0, year: m.format("YYYY") };
      });

      // Procesar datos
      for (const item of res.data) {
        const monthKey = dayjs(item.date).format("YYYY-MM");
        if (grouped.hasOwnProperty(monthKey)) {
          grouped[monthKey].total += item.estimated_consumption;
        }
      }

      // Convertir a array
      const processed: ProcessedMonthlyRecord[] = Object.entries(grouped).map(
        ([month, data]) => ({
          month: dayjs(month).format("MMM"),
          year: data.year,
          date: month + "-01", // Fecha ficticia para mantener formato
          total_kwh: parseFloat(data.total.toFixed(2)),
        })
      );

      return processed;
    },
  });
}