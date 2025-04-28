import apiClient from './apiClient';
import { ApiResponse, Notification } from './types';

export const notificationService = {
  getNotificationsForReceiver: async (receiverId: string): Promise<ApiResponse<Notification[]>> => {
    return apiClient.post<Notification[]>(`/notifications/receiver/${receiverId}`);
  },

  getNotificationsForSender: async (senderId: string): Promise<ApiResponse<Notification[]>> => {
    return apiClient.post<Notification[]>(`/notifications/sender/${senderId}`);
  },
};
