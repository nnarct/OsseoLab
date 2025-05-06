import { useQuery } from '@tanstack/react-query';
import axios from '@/config/axiosConfig';

type HasUnreadResponse = {
  hasUnread: boolean;
};

export const useHasUnreadNotification = () => {
  return useQuery<HasUnreadResponse>({
    queryKey: ['notification', 'hasUnread'],
    queryFn: async () => {
      const res = await axios.get('/notification/has-unread');
      return res.data.data;
    },
    staleTime: 1000 * 30, // 30 seconds
  });
};

export type Notification = {
  id: string;
  user_id: string;
  message: string;
  related_case_id: string;
  case_type: string;
  is_read: boolean;
  created_at: number;
  updated_at: number;
};

export const useNotificationList = () => {
  return useQuery<Notification[]>({
    queryKey: ['notification', 'list'],
    queryFn: async () => {
      const res = await axios.get('/notification/list');
      return res.data.data;
    },
  });
};
