// src/hooks/useDailyStreak.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios"; // Asegúrate de tener esta línea

interface UserProfile {
  streak: number;
}

interface UserData {
  id: string;
  email: string;
  username: string;
  user_profile: UserProfile;
}

export const useDailyStreak = () => {
  const { user } = useAuth();

  const fetchUser = async (): Promise<UserData | null> => {
    if (!user?.id) return null;
    const response = await api.get(`/users/${user.id}`);
    console.log("✔️ Respuesta real del backend:", response.data);
    return response.data;
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["userFullData", user?.id],
    queryFn: fetchUser,
    enabled: !!user?.id,
  });

  return {
    streak: data?.user_profile?.streak ?? 0,
    user: data,
    isLoading,
    error,
  };
};
