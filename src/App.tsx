import { Routes, Route } from "react-router-dom";
import { CssBaseline, Container } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";

import ShopsPage from "./pages/ShopsPage";
import CartPage from "./pages/CartPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import FindOrdersPage from "./pages/FindOrdersPage";
import CouponsPage from "./pages/CouponsPage";

import Navbar from "./components/Navbar";
import theme from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar />
      <Container
        maxWidth="lg"
        sx={{ mt: 3, mb: 4, animation: "fadeIn .3s ease" }}
      >
        <style>{`@keyframes fadeIn{from{opacity:0; transform: translateY(6px)} to{opacity:1; transform: translateY(0)}}`}</style>
        <Routes>
          <Route path="/" element={<ShopsPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/order/:id" element={<OrderDetailsPage />} />
          <Route path="/orders/find" element={<FindOrdersPage />} />
          <Route path="/coupons" element={<CouponsPage />} />
        </Routes>
      </Container>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </ThemeProvider>
  );
}

export default App;
