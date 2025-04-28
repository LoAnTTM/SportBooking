import apiClient from './apiClient';
import { 
  ApiResponse, 
  CreateMediaRequest, 
  CreateUnitRequest, 
  PaginatedResponse, 
  PaginationParams, 
  Unit, 
  UpdateUnitRequest 
} from './types';

export const unitService = {
  getUnits: async (params: PaginationParams): Promise<ApiResponse<PaginatedResponse<Unit>>> => {
    return apiClient.get<PaginatedResponse<Unit>>('/units', params);
  },

  getUnitById: async (id: string): Promise<ApiResponse<Unit>> => {
    return apiClient.get<Unit>(`/units/${id}`);
  },

  createUnit: async (data: CreateUnitRequest): Promise<ApiResponse<Unit>> => {
    return apiClient.post<Unit>('/units', data);
  },

  updateUnit: async (id: string, data: UpdateUnitRequest): Promise<ApiResponse<Unit>> => {
    return apiClient.put<Unit>(`/units/${id}`, data);
  },

  deleteUnit: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/units/${id}`);
  },

  addMedia: async (unitId: string, media: CreateMediaRequest): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/units/${unitId}/media`, media);
  },

  deleteMedia: async (mediaId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/units/media/${mediaId}`);
  },

  getBookedTime: async (unitId: string, bookedDay: string): Promise<ApiResponse<any>> => {
    return apiClient.post<any>(`/units/${unitId}/booked-time`, { booked_day: bookedDay });
  },

  getPopularUnits: async (params: any): Promise<ApiResponse<{ units: Unit[] }>> => {
    return apiClient.post<{ units: Unit[] }>('/units/popularity', params);
  },
};
