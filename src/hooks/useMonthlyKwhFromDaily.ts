// src/hooks/useMonthlyKwhFromDaily.ts
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import dayjs from "dayjs";

export interface DailyConsumption {
  id: string;
  user_id: string;
  device_id: string;
  date: string;
  hours_use: number;
  estimated_consumption: number;
  is_active: boolean;
}

export interface MonthlyKwh {
  month: string;    // Ej: "Julio"
  year: number;
  total_kwh: number;
}

export function useMonthlyKwhFromDaily(userId: string, month: number, year: number) {
  return useQuery<MonthlyKwh>({
    queryKey: ["monthly-kwh-from-daily", userId, month, year],
    queryFn: async () => {
      const response = await api.get<DailyConsumption[]>(`/daily-consumptions/user/${userId}`);

      const filteredData = response.data.filter((entry) => {
        if (!entry.is_active || !entry.date) return false;
        const entryDate = dayjs(entry.date);
        return entryDate.month() === month && entryDate.year() === year;
      });

      const total_kwh = filteredData.reduce((sum, entry) => sum + entry.estimated_consumption, 0);

      return {
        month: dayjs().month(month).format("MMMM"), // nombre del mes (Ej: "Julio")
        year,
        total_kwh: parseFloat(total_kwh.toFixed(2)),
      };
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000, // Opcional: 5 minutos para evitar recargas innecesarias
  });
}
