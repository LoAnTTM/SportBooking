import apiClient from './apiClient';
import { ApiResponse, CreateSportTypeRequest, SportType } from './types';

export const sportTypeService = {
  getSportTypes: async (): Promise<ApiResponse<SportType[]>> => {
    return apiClient.get<SportType[]>('/sport-types');
  },

  getSportTypeById: async (id: string): Promise<ApiResponse<SportType>> => {
    return apiClient.get<SportType>(`/sport-types/${id}`);
  },

  createSportType: async (data: CreateSportTypeRequest): Promise<ApiResponse<SportType>> => {
    return apiClient.post<SportType>('/sport-types', data);
  },

  updateSportType: async (id: string, data: CreateSportTypeRequest): Promise<ApiResponse<SportType>> => {
    return apiClient.put<SportType>(`/sport-types/${id}`, data);
  },

  deleteSportType: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/sport-types/${id}`);
  },
};
