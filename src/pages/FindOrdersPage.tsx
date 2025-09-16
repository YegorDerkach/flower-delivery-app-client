import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { ordersService } from "../services/orders";
import type { Order } from "../types";

function FindOrdersPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [last5, setLast5] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);

  const onSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await ordersService.search({
        email: email.trim() || undefined,
        last5: last5.trim() || undefined,
        phone: phone.trim() || undefined,
      } as any);
      setOrders(data);
    } catch (e: any) {
      setError(e?.message || "Failed to search");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
        Find your orders by any field
      </Typography>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <TextField
              label="Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, md: 3 }}>
            <TextField
              label="Last 5 of order ID"
              inputProps={{ maxLength: 5 }}
              value={last5}
              onChange={(e) => setLast5(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid
            size={{ xs: 12, md: 1 }}
            sx={{ display: "flex", alignItems: "stretch" }}
          >
            <Button
              variant="contained"
              color="primary"
              fullWidth
              onClick={onSearch}
              disabled={loading || (!email && !last5 && !phone)}
            >
              {loading ? "…" : "Go"}
            </Button>
          </Grid>
        </Grid>
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          Results
        </Typography>
        {orders.length === 0 ? (
          <Typography color="text.secondary">
            No orders yet. Try a different query.
          </Typography>
        ) : (
          <List>
            {orders.map((o) => (
              <>
                <ListItem key={o.orderId} alignItems="flex-start">
                  <ListItemText
                    primary={`Order ${o.orderId} — ${new Date(
                      o.createdAt as any
                    ).toLocaleString()}`}
                    secondary={
                      <>
                        <div>Email: {o.email}</div>
                        <div>Phone: {o.phone}</div>
                        <div>Total: {o.totalPrice} ₴</div>
                        <div>Items: {o.products?.length || 0}</div>
                      </>
                    }
                  />
                </ListItem>
                <Divider />
              </>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
}

export default FindOrdersPage;
