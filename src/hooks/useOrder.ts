import { useQuery } from '@tanstack/react-query';
import { ordersService } from '../services/orders';
import type { Order } from '../types';


export const useOrder = (orderId?: string) => {
  return useQuery<Order>({
    queryKey: ['order', orderId],
    queryFn: () => ordersService.getById(orderId as string),
    enabled: !!orderId,
  });
};