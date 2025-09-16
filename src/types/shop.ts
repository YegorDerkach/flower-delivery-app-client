export interface Shop {
  _id: string;
  name: string;
  address: string;
}

export interface Flower {
  _id: string;
  shopId: string;
  name: string;
  price: number;
  imageUrl?: string;
}

export interface UseFlowersParams {
  shopId: string | null;
  sortField: string;
  sortOrder: 'asc' | 'desc';
  isBouquet?: boolean;
  minPrice?: number;
  maxPrice?: number;
}
