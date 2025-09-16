import { api } from './api';
import type { CreateOrderData, OrderResponse, Order } from '../types';

export const ordersService = {

  create: async (orderData: CreateOrderData): Promise<OrderResponse> => {
    const response = await api.post<OrderResponse>('/api/orders', orderData);
    return response.data;
  },


  getById: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/api/orders/${id}`);
    return response.data;
  },

  search: async ({ email, last5, phone }: { email?: string; last5?: string; phone?: string }): Promise<Order[]> => {
    const params = new URLSearchParams();
    if (email) params.append('email', email);
    if (phone) params.append('phone', phone);
    if (last5) params.append('last5', last5);
    const response = await api.get<Order[]>(`/api/orders/search?${params.toString()}`);
    return response.data;
  },

  getAll: async (): Promise<Order[]> => {
    const response = await api.get<Order[]>('/api/orders');
    return response.data;
  },

  updateStatus: async (id: string, status: string): Promise<Order> => {
    const response = await api.patch<Order>(`/api/orders/${id}/status`, { status });
    return response.data;
  },

 
  cancel: async (id: string): Promise<Order> => {
    const response = await api.patch<Order>(`/api/orders/${id}/cancel`);
    return response.data;
  },

 
  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/orders/${id}`);
  },
};
