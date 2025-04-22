import { Unit } from '../types/unit';
import api from './api';

export const fetchUnits = async (): Promise<Unit[]> => {
  const response = await api.get('/units');
  return response.data;
};

export const fetchUnitById = async (id: string): Promise<Unit> => {
  const response = await api.get(`/units/${id}`);
  return response.data;
};

export const createUnit = async (unit: Unit): Promise<Unit> => {
  const response = await api.post('/units', unit);
  return response.data;
};

export const updateUnit = async (id: string, unit: Unit): Promise<Unit> => {
  const response = await api.put(`/units/${id}`, unit);
  return response.data;
};

export const deleteUnit = async (id: string): Promise<void> => {
  await api.delete(`/units/${id}`);
};