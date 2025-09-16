import { useQuery } from '@tanstack/react-query';
import { shopsService } from '../services/shops';
import type { Shop } from '../types';


export const useShops = () => {
  return useQuery<Shop[]>({
    queryKey: ['shops'],
    queryFn: shopsService.getAll
  });
};