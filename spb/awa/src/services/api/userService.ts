import apiClient from './apiClient';
import { ApiResponse, PaginationParams, User, Users } from './types';

export const userService = {
  getUsers: async (params?: PaginationParams): Promise<ApiResponse<Users>> => {
    return apiClient.get<Users>('/users', params);
  },

  getUserById: async (id: string): Promise<ApiResponse<User>> => {
    return apiClient.get<User>(`/users/${id}`);
  },

  createUser: async (data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.post<User>('/users', data);
  },

  updateUser: async (id: string, data: Partial<User>): Promise<ApiResponse<User>> => {
    return apiClient.put<User>(`/users/${id}`, data);
  },

  deleteUser: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/users/${id}`);
  },
};
