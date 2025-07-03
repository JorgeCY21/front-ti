
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

interface DailyConsumption {
  id: string;
  user_id: string;
  device_id: string;
  date: string;
  hours_use: number;
  estimated_consumption: number;
  is_active: boolean;
}

export function useDailyConsumptionsByDate(userId: string, date: string) {
  return useQuery<DailyConsumption[]>({
    queryKey: ["dailyConsumptions", userId, date],
    queryFn: async () => {
      const res = await api.get(`/daily-consumptions/user/${userId}/date?date=${date}`);
      return res.data;
    },
  });
}
