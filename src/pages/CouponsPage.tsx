import { useState } from "react";
import {
  Typography,
  Card,
  CardContent,
  Box,
  Chip,
  Button,
  Skeleton,
  Alert,
} from "@mui/material";

import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useCoupons } from "../hooks/useCoupons";
import { toast } from "react-toastify";

function CouponsPage() {
  const { data: coupons, isLoading, error } = useCoupons();
  console.log(coupons);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const copyToClipboard = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      toast.success("Код купона скопійовано!");
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error("Не вдалося скопіювати код");
    }
  };

  const formatDiscount = (coupon: any) => {
    if (coupon.discountType === "percent") {
      return `${coupon.discountValue}%`;
    }
    return `${coupon.discountValue} ₴`;
  };

  const isExpired = (validUntil: Date) => {
    return new Date(validUntil) < new Date();
  };

  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Alert severity="error">
          Помилка завантаження купонів. Спробуйте пізніше.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Купони
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Використовуйте ці купони для отримання знижок на ваші замовлення
      </Typography>

      {isLoading ? (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={200} />
          ))}
        </Box>
      ) : coupons && coupons.length > 0 ? (
        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
          }}
        >
          {coupons.map((coupon) => (
            <Card
              key={coupon._id}
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                opacity: isExpired(coupon.validUntil) ? 0.6 : 1,
                border: isExpired(coupon.validUntil)
                  ? "1px solid #f44336"
                  : "1px solid #e0e0e0",
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Typography variant="h6" component="div">
                    {coupon.code}
                  </Typography>
                  <Button
                    size="small"
                    startIcon={<ContentCopyIcon />}
                    onClick={() => copyToClipboard(coupon.code)}
                    disabled={copiedCode === coupon.code}
                  >
                    {copiedCode === coupon.code ? "Скопійовано" : "Копіювати"}
                  </Button>
                </Box>

                <Box sx={{ mb: 2 }}>
                  <Chip
                    label={`Знижка ${formatDiscount(coupon)}`}
                    color={
                      coupon.discountType === "percent"
                        ? "primary"
                        : "secondary"
                    }
                    variant="outlined"
                  />
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>Тип знижки:</strong>{" "}
                  {coupon.discountType === "percent"
                    ? "Відсоток"
                    : "Фіксована сума"}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 1 }}
                >
                  <strong>Дійсний до:</strong>{" "}
                  {new Date(coupon.validUntil).toLocaleDateString("uk-UA")}
                </Typography>

                {isExpired(coupon.validUntil) && (
                  <Chip
                    label="Прострочений"
                    color="error"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </Box>
      ) : (
        <Alert severity="info">Наразі немає доступних купонів</Alert>
      )}
    </Box>
  );
}

export default CouponsPage;
