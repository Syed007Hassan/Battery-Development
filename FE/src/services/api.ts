import axios from 'axios';
import { Car, CarResponse } from '../types/car';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface QueryParams {
  search?: string;
  filter?: string[];
  sort?: string;
  page?: number;
  limit?: number;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getCars = async (params?: QueryParams): Promise<CarResponse> => {
  const response = await api.get<CarResponse>('/cars', { params });
  return response.data;
};

export const getCarById = async (id: string): Promise<Car> => {
  const response = await api.get<Car>(`/cars/${id}`);
  return response.data;
};

export const deleteCar = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/cars/${id}`);
  return response.data;
}; 