import axios from 'axios';
import { Club } from '../types/club';

const API_URL = '/api/clubs';

export const fetchClubs = async (): Promise<Club[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const fetchClubById = async (id: string): Promise<Club> => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createClub = async (club: Club): Promise<Club> => {
  const response = await axios.post(API_URL, club);
  return response.data;
};

export const updateClub = async (id: string, club: Club): Promise<Club> => {
  const response = await axios.put(`${API_URL}/${id}`, club);
  return response.data;
};

export const deleteClub = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};