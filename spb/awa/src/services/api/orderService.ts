import apiClient from './apiClient';
import { ApiResponse, Order, PayRequest } from './types';

export const orderService = {
  getOrdersByUserId: async (userId: string): Promise<ApiResponse<Order[]>> => {
    return apiClient.get<Order[]>(`/orders/${userId}`);
  },

  pay: async (data: PayRequest): Promise<ApiResponse<any>> => {
    return apiClient.post<any>('/orders/pay', data);
  },
};
