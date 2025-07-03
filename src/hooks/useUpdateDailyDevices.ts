import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";

interface UpdatePayload {
  id: string; // el ID del daily consumption
  hours_use: number;
}

export function useUpdateDailyDevices() {
  return useMutation({
    mutationFn: (data: UpdatePayload) =>
      api.put(`/daily-consumptions/${data.id}`, { hours_use: data.hours_use }),
  });
}
