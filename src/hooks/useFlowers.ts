import { useQuery } from '@tanstack/react-query';
import { flowersService } from '../services/flowers';
import type { Flower, UseFlowersParams, PaginatedResponse } from '../types';

export interface UseFlowersWithPagination extends UseFlowersParams {
  page?: number;
  limit?: number;
}

export const useFlowers = (params: UseFlowersWithPagination) => {
  return useQuery<PaginatedResponse<Flower>>({
    queryKey: ['flowers', params.shopId, params.sortField, params.sortOrder, params.page, params.limit, params.isBouquet, params.minPrice, params.maxPrice],
    queryFn: () => flowersService.getByShop({
      shopId: params.shopId!,
      sort: params.sortField,
      order: params.sortOrder,
      page: params.page,
      limit: params.limit,
      isBouquet: params.isBouquet,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
    } as any),
    enabled: !!params.shopId,
    placeholderData: (previous: PaginatedResponse<Flower> | undefined) => previous,
    staleTime: 30_000,
  });
};

