import { useMutation, useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export type Notification = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  created_at: string;
  was_read: boolean;
  is_active: boolean;
};

// ✅ Obtener notificaciones de un usuario
export const useNotificationsByUser = (userId: string) => {
  return useQuery({
    queryKey: ["notifications", userId],
    queryFn: async () => {
      const res = await api.get<Notification[]>(`/notifications/user/${userId}`);
      return res.data;
    },
    enabled: !!userId,
  });
};

// ✅ Marcar como leída
export const useMarkAsRead = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await api.patch(`/notifications/${id}/mark-as-read`);
    },
  });
};

// ✅ Eliminar notificación
export const useDeleteNotification = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/notifications/${id}`);
    },
  });
};
