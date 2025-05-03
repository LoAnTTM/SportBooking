import apiClient from './apiClient';
import {
  ApiResponse, Club, Clubs, CreateClubRequest, CreateMediaRequest, UpdateClubRequest
} from './types';

export const clubService = {
  getClubs: async (): Promise<ApiResponse<Clubs>> => {
    return apiClient.get<Clubs>('/clubs');
  },

  getClubById: async (id: string): Promise<ApiResponse<Club>> => {
    return apiClient.get<Club>(`/clubs/${id}`);
  },

  createClub: async (data: CreateClubRequest): Promise<ApiResponse<Club>> => {
    return apiClient.post<Club>('/clubs', data);
  },

  updateClub: async (id: string, data: UpdateClubRequest): Promise<ApiResponse<Club>> => {
    return apiClient.put<Club>(`/clubs/${id}`, data);
  },

  deleteClub: async (id: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/clubs/${id}`);
  },

  addMedia: async (clubId: string, media: CreateMediaRequest): Promise<ApiResponse<void>> => {
    return apiClient.post<void>(`/clubs/${clubId}/media`, media);
  },

  deleteMedia: async (mediaId: string): Promise<ApiResponse<void>> => {
    return apiClient.delete<void>(`/clubs/media/${mediaId}`);
  },
};
