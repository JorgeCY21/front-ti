import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

interface District {
  id: number;
  name: string;
  fee_kwh: number;
  is_active: boolean;
}

export function useDistricts() {
  return useQuery<District[]>({
    queryKey: ["districts"],
    queryFn: async () => {
      const response = await api.get("/districts");
      return response.data;
    },
  });
}
