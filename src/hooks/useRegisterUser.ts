import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  district_id: number;
  first_name: string;
  last_name: string;
  taste: string[];
  is_active: boolean;
}

export function useRegisterUser() {
  return useMutation({
    mutationFn: (data: RegisterPayload) => api.post('/users', data),
  });
}
