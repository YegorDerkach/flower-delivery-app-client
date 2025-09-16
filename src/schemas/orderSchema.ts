import * as yup from 'yup';
import type { OrderFormData, CartItem } from '../types';



export const orderFormSchema = yup.object({
  email: yup.
  string().
  email('Введіть коректний email').
  required('Email обов\'язковий'),
  phone: yup.
  string().
  matches(/^[\+]?[0-9\s\-\(\)]{10,}$/, 'Введіть коректний номер телефону').
  required('Телефон обов\'язковий'),
  address: yup.
  string().
  min(10, 'Адреса повинна містити мінімум 10 символів').
  required('Адреса доставки обов\'язкова'),
  coupon: yup.
  string().
  optional().
  default('')
});


export const orderSchema = yup.object({
  formData: orderFormSchema,
  cartItems: yup.
  array().
  of(
    yup.object({
      id: yup.string().required(),
      name: yup.string().required(),
      price: yup.number().positive().required(),
      quantity: yup.number().positive().required(),
      imageUrl: yup.string().optional()
    })
  ).
  min(1, 'Додайте хоча б один товар до кошика').
  required('Кошик не може бути порожнім')
});


export const validateOrder = (formData: OrderFormData, cartItems: CartItem[]) => {
  return orderSchema.validate({
    formData,
    cartItems
  }, { abortEarly: false });
};