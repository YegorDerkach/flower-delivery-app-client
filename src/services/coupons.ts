import { api } from "./api";
import type { Coupon } from "../types";


export const couponsService = {

  getAll: async (): Promise<Coupon[]> => {
    const response = await api.get<Coupon[]>("/api/coupons");
    return response.data;
  },


  getByCode: async (code: string): Promise<Coupon> => {
    const response = await api.get<Coupon>(`/api/coupons/${code}`);
    return response.data;
  },
};
