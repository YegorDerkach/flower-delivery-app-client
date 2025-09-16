import { useQuery } from "@tanstack/react-query";
import { couponsService } from "../services/coupons";
import type { Coupon } from "../types";

export const useCoupons = () => {
  return useQuery<Coupon[]>({
    queryKey: ["coupons"],
    queryFn: () => couponsService.getAll(),
    staleTime: 0,
  });
};

export const useCouponByCode = (code: string) => {
  return useQuery<Coupon>({
    queryKey: ["coupon", "code", code],
    queryFn: () => couponsService.getByCode(code),
    enabled: !!code && code.length > 0,
    staleTime: 0,
  });
};
