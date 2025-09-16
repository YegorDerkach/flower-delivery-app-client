import { useMutation } from '@tanstack/react-query';
import { ordersService } from '../services/orders';

export const useCreateOrder = () => {
  return useMutation({
    mutationFn: ordersService.create,
    onSuccess: (data) => {
      console.log('Order created successfully:', data);
    },
    onError: (error) => {
      console.error('Error creating order:', error);
    }
  });
};