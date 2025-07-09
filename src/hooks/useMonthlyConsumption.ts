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

export interface ProcessedMonthlyRecord {
  month: string;        // Ej: "Jul"
  monthNumber: number;  // 0 = Enero, 6 = Julio, etc.
  total_kwh: number;
  year: string;
  date: string;
}

export function useMonthlyConsumption(userId: string) {
  return useQuery<ProcessedMonthlyRecord[]>({
    queryKey: ["monthly-consumption", userId],
    queryFn: async () => {
      const res = await api.get<RawMonthlyRecord[]>(`/monthly-consumptions/user/${userId}`);

      const last12Months = Array.from({ length: 12 }, (_, i) =>
        dayjs().subtract(i, "month")
      ).reverse();

      const grouped: Record<string, { total: number; year: string }> = {};
      last12Months.forEach((m) => {
        const key = m.format("YYYY-MM");
        grouped[key] = { total: 0, year: m.format("YYYY") };
      });

      for (const item of res.data) {
        const monthKey = dayjs(item.date).format("YYYY-MM");
        if (grouped.hasOwnProperty(monthKey)) {
          grouped[monthKey].total += item.estimated_consumption;
        }
      }

      const processed: ProcessedMonthlyRecord[] = Object.entries(grouped).map(
        ([month, data]) => {
          const dateObj = dayjs(month + "-01");
          return {
            month: dateObj.format("MMM"),
            monthNumber: dateObj.month(), // 0 a 11
            year: data.year,
            date: month + "-01",
            total_kwh: parseFloat(data.total.toFixed(2)),
          };
        }
      );

      return processed;
    },
  });
}
