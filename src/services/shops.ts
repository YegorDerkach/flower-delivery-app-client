import { api } from './api';
import type { Shop } from '../types';





export const shopsService = {



  getAll: async (): Promise<Shop[]> => {
    const response = await api.get<Shop[]>('/api/shops');
    return response.data as any;
  },




  getById: async (id: string): Promise<Shop> => {
    const response = await api.get<Shop>(`/api/shops/${id}`);
    return response.data as any;
  },




  create: async (shopData: Omit<Shop, '_id'>): Promise<Shop> => {
    const response = await api.post<Shop>('/api/shops', shopData);
    return response.data as any;
  },




  update: async (id: string, shopData: Partial<Shop>): Promise<Shop> => {
    const response = await api.put<Shop>(`/api/shops/${id}`, shopData);
    return response.data as any;
  },




  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/shops/${id}`);
  }
};