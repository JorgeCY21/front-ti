import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export interface Video {
  id: number;
  title: string;
  url: string;
  duration_seg: number;
  is_active: boolean;
}

export function useVideos() {
  return useQuery<Video[]>({
    queryKey: ["videos"],
    queryFn: async () => {
      const response = await api.get("/videos");
      return response.data;
    },
  });
}
