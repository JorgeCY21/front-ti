// hooks/useUserMedals.ts
import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export type UserMedal = {
  user_id: string;
  melda_id: number;
  achievement_date: string;
  is_active: boolean;
  medal?: {
    id: number;
    name: string;
    url_img: string;
  };
};

export const useUserMedals = (userId: string) =>
  useQuery<UserMedal[]>({
    queryKey: ["userMedals", userId],
    queryFn: async () => {
      const res = await api.get(`/users-medals/user/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
