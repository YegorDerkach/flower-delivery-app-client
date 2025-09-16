export interface Coupon {
  _id: string;
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  validUntil: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
