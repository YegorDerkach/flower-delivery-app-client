import { useCart } from "../context/CartContext";
import {
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Box,
  Paper,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useCreateOrder } from "../hooks/useCreateOrder";
import { useCouponByCode } from "../hooks/useCoupons";
import { orderFormSchema, validateOrder } from "../schemas/orderSchema";
import type { OrderFormData, CartItem, Coupon } from "../types";
import { API_BASE_URL } from "../services/api";
import { useState, useEffect } from "react";

function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCart();
  const navigate = useNavigate();
  const createOrderMutation = useCreateOrder();

  const typedItems = items as CartItem[];
  const subtotal = typedItems.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0
  );


  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discount, setDiscount] = useState(0);
  const [shouldCheckCoupon, setShouldCheckCoupon] = useState(false);

  const {
    data: coupon,
    isLoading: couponLoading,
    error: couponError,
  } = useCouponByCode(shouldCheckCoupon ? couponCode : "");

  const total = subtotal - discount;


  const applyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Введіть код купона");
      return;
    }

    setShouldCheckCoupon(true);
  };

 
  useEffect(() => {
    if (coupon && shouldCheckCoupon) {
      const now = new Date();
      const validUntil = new Date(coupon.validUntil);

      if (validUntil < now) {
        toast.error("Купон прострочений");
        setShouldCheckCoupon(false);
        return;
      }

      let calculatedDiscount = 0;
      if (coupon.discountType === "percent") {
        calculatedDiscount = (subtotal * coupon.discountValue) / 100;
      } else {
        calculatedDiscount = coupon.discountValue;
      }

   
      calculatedDiscount = Math.min(calculatedDiscount, subtotal);

      setAppliedCoupon(coupon);
      setDiscount(calculatedDiscount);
      toast.success(`Купон "${coupon.code}" застосовано!`);
      setShouldCheckCoupon(false);
    }
  }, [coupon, shouldCheckCoupon, subtotal]);


  useEffect(() => {
    if (couponError && shouldCheckCoupon) {
      toast.error("Невірний купон");
      setShouldCheckCoupon(false);
    }
  }, [couponError, shouldCheckCoupon]);

  
  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscount(0);
    setCouponCode("");
    setShouldCheckCoupon(false);
    toast.info("Купон видалено");
  };


  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<OrderFormData>({
    resolver: yupResolver(orderFormSchema) as any,
    defaultValues: {
      email: "",
      phone: "",
      address: "",
      coupon: "",
    },
  });

 
  const onSubmit = async (data: OrderFormData) => {
    try {
     
      await validateOrder(data, typedItems);

      const orderData = {
        products: typedItems.map((i: CartItem) => ({
          flowerId: i.id,
          quantity: i.quantity,
          price: i.price,
        })),
        totalPrice: total,
        email: data.email,
        phone: data.phone,
        address: data.address,
        coupon: appliedCoupon?.code || "",
      };

      const order = await createOrderMutation.mutateAsync(orderData);
      clearCart();
      toast.success("Замовлення успішно створено!");
      navigate(`/order/${order.orderId}`);
    } catch (err: any) {
      console.error(err);
      
      if (err.name === "ValidationError") {
        const errorMessages = err.errors || [err.message];
        errorMessages.forEach((message: string) => {
          toast.error(message);
        });
      } else {
        toast.error("Помилка при створенні замовлення");
      }
    }
  };

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2, mt: 2 }}>
      <Box>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" gutterBottom>
            Форма доставки
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="phone"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Телефон"
                  type="tel"
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  required
                  fullWidth
                />
              )}
            />
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Адреса доставки"
                  placeholder="Введіть адресу доставки"
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  required
                  fullWidth
                />
              )}
            />

            <Box sx={{ border: "1px solid #e0e0e0", borderRadius: 1, p: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Купон-код
              </Typography>

              {appliedCoupon ? (
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}
                >
                  <Chip
                    label={`${appliedCoupon.code} - ${
                      appliedCoupon.discountType === "percent"
                        ? `${appliedCoupon.discountValue}%`
                        : `${appliedCoupon.discountValue} ₴`
                    }`}
                    color="success"
                    onDelete={removeCoupon}
                  />
                </Box>
              ) : (
                <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
                  <TextField
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    label="Введіть код купона"
                    size="small"
                    sx={{ flex: 1 }}
                    disabled={couponLoading}
                    helperText={couponLoading ? "Перевірка купона..." : ""}
                  />
                  <Button
                    variant="outlined"
                    onClick={applyCoupon}
                    disabled={!couponCode.trim() || couponLoading}
                    size="small"
                  >
                    {couponLoading ? "Перевірка..." : "Застосувати"}
                  </Button>
                </Box>
              )}
            </Box>

            <Box
              sx={{
                mt: 1,
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
              }}
            >
              <Button variant="outlined" color="error" onClick={clearCart}>
                Очистити кошик
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={
                  createOrderMutation.isPending || typedItems.length === 0
                }
              >
                {createOrderMutation.isPending
                  ? "Обробка..."
                  : typedItems.length === 0
                  ? "Додайте товари до кошика"
                  : "Оформити замовлення"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>

      <Box>
        <Paper
          sx={{
            p: 3,
            height: "500px",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="h6">Товари</Typography>
          <Divider sx={{ my: 1 }} />

          <Box sx={{ flex: 1, overflowY: "auto" }}>
            <List>
              {typedItems.map((item: CartItem) => (
                <ListItem key={item.id} alignItems="flex-start">
                  {item.imageUrl && (
                    <img
                      src={`${API_BASE_URL}${item.imageUrl}`}
                      alt={item.name}
                      style={{
                        width: 64,
                        height: 64,
                        objectFit: "cover",
                        borderRadius: 8,
                        marginRight: 12,
                      }}
                    />
                  )}

                  <ListItemText
                    primary={`${item.name} — ${item.price} ₴`}
                    secondary={`Кількість: ${item.quantity}`}
                  />

                  <TextField
                    type="number"
                    size="small"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.id, Number(e.target.value))
                    }
                    sx={{ width: 80, ml: 2 }}
                  />

                  <Button
                    color="error"
                    onClick={() => removeFromCart(item.id)}
                    sx={{ ml: 2 }}
                  >
                    Видалити
                  </Button>
                </ListItem>
              ))}
            </List>
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography>Підсумок:</Typography>
              <Typography>{subtotal} ₴</Typography>
            </Box>

            {discount > 0 && (
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography color="success.main">Знижка:</Typography>
                <Typography color="success.main">-{discount} ₴</Typography>
              </Box>
            )}

            <Divider />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Разом:</Typography>
              <Typography variant="h6">{total} ₴</Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}

export default CartPage;
