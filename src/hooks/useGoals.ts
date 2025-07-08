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

// Actualizar una meta existente
export const useUpdateGoal = () => {
  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: { estimated_cost: number; month: string; year: number };
    }) => {
      const response = await api.put(`/goals/${id}`, data);
      return response.data;
    },
  });
};


export const useDeleteGoal = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/goals/${id}`);
      return response.data;
    },
  });
};