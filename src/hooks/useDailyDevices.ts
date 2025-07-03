import { useMutation } from '@tanstack/react-query';
import api from '../api/axios';

interface DailyDevices {
  user_id: string;
  device_id: string;
  hours_use: number;
  is_active: boolean;
}

export function useDailyDevices() {
  return useMutation({
    mutationFn: (data: DailyDevices) => api.post('/daily-consumptions', data),
  });
}
