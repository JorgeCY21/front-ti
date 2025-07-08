// hooks/useRegisterUserVideo.ts
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";

interface RegisterUserVideoInput {
  user_id: string;
  video_id: number;
}

export function useRegisterUserVideo() {
  return useMutation({
    mutationFn: async ({ user_id, video_id }: RegisterUserVideoInput) => {
      const response = await api.post("/users-videos", {
        user_id,
        video_id,
        is_active: true,
      });
      return response.data;
    },
  });
}
