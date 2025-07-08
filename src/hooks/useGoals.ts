import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export type Goal = {
  id: string;
  user_id: string;
  month: string;
  year: number;
  goal_kwh: number;
  estimated_cost: number;
  is_active: boolean;
};

// Obtener metas de un usuario
export const useGoalsByUser = (userId: string) => {
  return useQuery({
    queryKey: ["goals", userId],
    queryFn: async () => {
      const response = await api.get<Goal[]>(`/goals/user/${userId}`);
      return response.data;
    },
    enabled: !!userId, // solo si hay ID
  });
};

// Crear nueva meta
export const useCreateGoal = () => {
  return useMutation({
    mutationFn: async ({
      user_id,
      estimated_cost,
      is_active = true,
    }: {
      user_id: string;
      estimated_cost: number;
      is_active?: boolean;
    }) => {
      const response = await api.post("/goals", {
        user_id,
        estimated_cost,
        is_active,
      });
      return response.data;
    },
  });
};
