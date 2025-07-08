import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";
import dayjs from "dayjs";

interface RawDailyRecord {
  id: string;
  date: string;
  estimated_consumption: number;
  user_id: string;
  is_active: boolean;
}

interface ProcessedDailyRecord {
  date: string;
  total_kwh: number;
}

export function useBiweeklyConsumption(userId: string) {
  return useQuery<ProcessedDailyRecord[]>({
    queryKey: ["biweekly-consumption", userId],
    queryFn: async () => {
      const res = await api.get<RawDailyRecord[]>(`/daily-consumptions/user/${userId}`);

      const last15Days = Array.from({ length: 15 }, (_, i) =>
        dayjs().subtract(i, "day").format("YYYY-MM-DD")
      ).reverse();

      // Inicializamos un mapa por día
      const grouped: Record<string, number> = {};
      last15Days.forEach((d) => (grouped[d] = 0));

      for (const item of res.data) {
        const date = dayjs(item.date).format("YYYY-MM-DD");
        if (grouped.hasOwnProperty(date)) {
          grouped[date] += item.estimated_consumption;
        }
      }

      // Convertimos a array
      const processed: ProcessedDailyRecord[] = last15Days.map((d) => ({
        date: d,
        total_kwh: parseFloat(grouped[d].toFixed(2)),
      }));

      return processed;
    },
  });
}