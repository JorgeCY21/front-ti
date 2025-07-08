// hooks/useUserVideos.ts
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export interface UserVideo {
  video_id: number;
  user_id: string;
  date_seen: string;
  is_active: boolean;
}

export function useUserVideos(user_id: string) {
  return useQuery<UserVideo[]>({
    queryKey: ["user-videos", user_id],
    queryFn: async () => {
      const response = await api.get("/users-videos", {
        params: { user_id },
      });
      return response.data;
    },
    enabled: !!user_id, // solo corre si hay user_id
  });
}
