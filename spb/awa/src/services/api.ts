import axios from 'axios';

const API_BASE_URL = 'https://api.example.com'; // Replace with your actual API base URL

export const fetchClubs = async () => {
  const response = await axios.get(`${API_BASE_URL}/clubs`);
  return response.data;
};

export const fetchClubById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/clubs/${id}`);
  return response.data;
};

export const createClub = async (clubData) => {
  const response = await axios.post(`${API_BASE_URL}/clubs`, clubData);
  return response.data;
};

export const updateClub = async (id, clubData) => {
  const response = await axios.put(`${API_BASE_URL}/clubs/${id}`, clubData);
  return response.data;
};

export const deleteClub = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/clubs/${id}`);
  return response.data;
};

export const fetchUnits = async () => {
  const response = await axios.get(`${API_BASE_URL}/units`);
  return response.data;
};

export const fetchUnitById = async (id) => {
  const response = await axios.get(`${API_BASE_URL}/units/${id}`);
  return response.data;
};

export const createUnit = async (unitData) => {
  const response = await axios.post(`${API_BASE_URL}/units`, unitData);
  return response.data;
};

export const updateUnit = async (id, unitData) => {
  const response = await axios.put(`${API_BASE_URL}/units/${id}`, unitData);
  return response.data;
};

export const deleteUnit = async (id) => {
  const response = await axios.delete(`${API_BASE_URL}/units/${id}`);
  return response.data;
};