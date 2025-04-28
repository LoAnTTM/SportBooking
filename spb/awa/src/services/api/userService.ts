import apiClient from './apiClient';
import { ApiResponse, PaginatedResponse, PaginationParams, User } from './types';

export const userService = {
  getUsers: async (params: PaginationParams): Promise<ApiResponse<PaginatedResponse<User>>> => {
    return apiClient.get<PaginatedResponse<User>>('/users', params);
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
