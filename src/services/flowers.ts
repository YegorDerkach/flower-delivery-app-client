import { api } from './api';
import type { Flower, PaginationParams, PaginatedResponse } from '../types';

export interface GetFlowersParams extends PaginationParams {
  shopId: string;
  isBouquet?: boolean;
  minPrice?: number;
  maxPrice?: number;
}


export const flowersService = {

  getByShop: async (params: GetFlowersParams): Promise<PaginatedResponse<Flower>> => {
    const { shopId, sort = 'price', order = 'asc', page = 1, limit = 12, isBouquet, minPrice, maxPrice } = params;
    const usp = new URLSearchParams();
    usp.append('shopId', shopId);
    usp.append('sort', sort);
    usp.append('order', order);
    usp.append('page', String(page));
    usp.append('limit', String(limit));
    if (typeof isBouquet !== 'undefined') usp.append('isBouquet', String(isBouquet));
    if (typeof minPrice !== 'undefined') usp.append('minPrice', String(minPrice));
    if (typeof maxPrice !== 'undefined') usp.append('maxPrice', String(maxPrice));

    const response = await api.get<{
      data: Flower[];
      total: number;
      page: number;
      pages: number;
    }>(`/api/flowers?${usp.toString()}`);

    const { data, total, page: currentPage, pages } = response.data;
    return {
      data,
      total,
      page: currentPage,
      limit,
      totalPages: pages,
      success: true,
    } as any;
  },

 
  getAll: async (params?: PaginationParams): Promise<Flower[]> => {
    const queryParams = new URLSearchParams();
    if (params?.sort) queryParams.append('sort', params.sort);
    if (params?.order) queryParams.append('order', params.order);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());

    const response = await api.get<{ data: Flower[] }>(`/api/flowers?${queryParams}`);
    return response.data.data;
  },


  getById: async (id: string): Promise<Flower> => {
    const response = await api.get<Flower>(`/api/flowers/${id}`);
    return response.data;
  },

  create: async (flowerData: Omit<Flower, '_id'>): Promise<Flower> => {
    const response = await api.post<Flower>('/api/flowers', flowerData);
    return response.data;
  },

 
  update: async (id: string, flowerData: Partial<Flower>): Promise<Flower> => {
    const response = await api.put<Flower>(`/api/flowers/${id}`, flowerData);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/api/flowers/${id}`);
  },
};
