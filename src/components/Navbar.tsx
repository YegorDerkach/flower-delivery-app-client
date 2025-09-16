import { AppBar, Toolbar, Typography, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function Navbar() {
  return (
    <AppBar position="sticky" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar
          sx={{ display: "flex", justifyContent: "space-between", py: 1 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            🌸 Flower Delivery
          </Typography>
          <div>
            <Button
              color="primary"
              variant="text"
              component={RouterLink}
              to="/"
              sx={{ mr: 1 }}
            >
              Магазини
            </Button>
            <Button
              color="primary"
              variant="text"
              component={RouterLink}
              to="/orders/find"
              sx={{ mr: 1 }}
            >
              Замовлення
            </Button>
            <Button
              color="primary"
              variant="text"
              component={RouterLink}
              to="/coupons"
              sx={{ mr: 1 }}
            >
              Купони
            </Button>
            <Button
              color="primary"
              variant="contained"
              component={RouterLink}
              to="/cart"
            >
              Кошик
            </Button>
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
