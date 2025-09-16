import { useParams } from "react-router-dom";
import {
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  Card,
  CardContent,
  Divider,
  Chip,
} from "@mui/material";
import { useOrder } from "../hooks/useOrder";
// no-op

function OrderDetailsPage() {
  const { id } = useParams();

  const { data: order, isLoading } = useOrder(id);

  if (isLoading) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6">Завантаження...</Typography>
      </Box>
    );
  }

  if (!order) {
    return (
      <Box sx={{ mt: 4, textAlign: "center" }}>
        <Typography variant="h6" color="error">
          Замовлення не знайдено
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4, maxWidth: 800, mx: "auto", p: 2 }}>
      <Typography variant="h4" gutterBottom>
        Деталі замовлення
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Інформація про замовлення
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography>
              <strong>Номер замовлення:</strong> {order.orderId}
            </Typography>
            <Typography>
              <strong>Email:</strong> {order.email}
            </Typography>
            <Typography>
              <strong>Телефон:</strong> {order.phone}
            </Typography>
            <Typography>
              <strong>Адреса:</strong> {order.address}
            </Typography>
            {order.createdAt && (
              <Typography>
                <strong>Дата створення:</strong>{" "}
                {new Date(order.createdAt).toLocaleString("uk-UA")}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Товари в замовленні
          </Typography>

          <List>
            {order.products.map((product, index) => {
              const flower = product.flowerId as any;
              const key = typeof product.flowerId === 'string' ? `${product.flowerId}-${index}` : flower._id;
              const name = typeof product.flowerId === 'string' ? product.flowerId : flower.name;
              return (
              <div key={key}>
                <ListItem>
                  <ListItemText
                    primary={`${name} × ${product.quantity}`}
                    secondary={`${product.price} ₴ за одиницю`}
                  />
                  <Chip
                    label={`${order.totalPrice} ₴`}
                    color="primary"
                    variant="outlined"
                  />
                </ListItem>
                {index < order.products.length - 1 && <Divider />}
              </div>
              );
            })}
          </List>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">Загальна сума:</Typography>
            <Typography variant="h4" color="primary" fontWeight="bold">
              {order.totalPrice} ₴
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

export default OrderDetailsPage;
