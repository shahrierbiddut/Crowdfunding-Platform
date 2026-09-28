import api from '../lib/axios';

export const notificationService = {
  getMyNotifications: async () => {
    const response = await api.get('/api/notifications/my');
    return response.data;
  },
  markAsRead: async (id: string) => {
    const response = await api.patch(`/api/notifications/${id}/read`);
    return response.data;
  }
};
