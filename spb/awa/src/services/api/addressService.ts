import apiClient from './apiClient';
import { ApiResponse, District, Province, Ward } from './types';

export const addressService = {
  getProvinces: async (): Promise<ApiResponse<Province[]>> => {
    return apiClient.get<Province[]>('/addresses/provinces');
  },

  getProvinceById: async (id: string): Promise<ApiResponse<Province>> => {
    return apiClient.get<Province>(`/addresses/provinces/${id}`);
  },

  getProvinceDistricts: async (provinceId: string): Promise<ApiResponse<District[]>> => {
    return apiClient.get<District[]>(`/addresses/provinces/${provinceId}/districts`);
  },

  getDistrictById: async (id: string): Promise<ApiResponse<District>> => {
    return apiClient.get<District>(`/addresses/districts/${id}`);
  },

  getDistrictWards: async (districtId: string): Promise<ApiResponse<Ward[]>> => {
    return apiClient.get<Ward[]>(`/addresses/districts/${districtId}/wards`);
  },

  getWardById: async (id: string): Promise<ApiResponse<Ward>> => {
    return apiClient.get<Ward>(`/addresses/wards/${id}`);
  },
};
