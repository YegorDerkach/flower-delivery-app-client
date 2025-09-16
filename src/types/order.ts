// Removed unused import

export interface OrderProductInput {
  flowerId: string;
  quantity: number;
  price: number;
}

export interface CreateOrderData {
  products: OrderProductInput[];
  totalPrice: number;
  email: string;
  phone: string;
  address: string;
  coupon?: string;
}

export interface OrderFormData {
  email: string;
  phone: string;
  address: string;
  coupon: string;
}

export interface OrderProduct {
  flowerId: string | { _id: string; name: string };
  quantity: number;
  price: number;
}

export interface Order {
  orderId: string;
  products: OrderProduct[];
  totalPrice: number;
  email: string;
  phone: string;
  address: string;
  createdAt?: string | Date;
}

export interface OrderResponse extends Order {}