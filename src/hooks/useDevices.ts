import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

interface Devices {
  id: string;
  name: string;
  consumption_kwh_h: number;
  url: string;
  is_active: boolean;
}

export function useDevices() {
  return useQuery<Devices[]>({
    queryKey: ["devices"],
    queryFn: async () => {
      const response = await api.get("/devices");
      return response.data;
    },
  });
}
