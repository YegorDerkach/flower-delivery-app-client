import { useState, useEffect, useMemo, useRef } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Select,
  MenuItem,
  Box,
  IconButton,
  Pagination,
  CardActionArea,
  Switch,
  FormControlLabel,
  Slider,
  Skeleton,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { useCart } from "../context/CartContext";
import { useShops } from "../hooks/useShops";
import { useFlowers } from "../hooks/useFlowers";
import { API_BASE_URL } from "../services/api";

const FAVORITES_STORAGE_KEY = "favoriteFlowers";

function ShopsPage() {
  console.log(API_BASE_URL);
  const { addToCart } = useCart();
  const [selectedShop, setSelectedShop] = useState<string | null>(null);


  const [sortField, setSortField] = useState("price");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  const [page, setPage] = useState(1);
  const [limit] = useState(12);


  const [bouquetsOnly, setBouquetsOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);


  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

  const animRootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (raw) setFavoriteIds(new Set(JSON.parse(raw)));
    } catch {}
  }, []);


  const { data: shops, isLoading: shopsLoading } = useShops();
  useEffect(() => {
    if (!selectedShop && shops && shops.length > 0)
      setSelectedShop(shops[0]._id);
  }, [shops, selectedShop]);

  useEffect(() => {
    setPage(1);
  }, [
    selectedShop,
    sortField,
    sortOrder,
    bouquetsOnly,
    priceRange[0],
    priceRange[1],
    favoritesOnly,
  ]);

  const toggleFavorite = (id: string) => {
    setFavoriteIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      try {
        localStorage.setItem(
          FAVORITES_STORAGE_KEY,
          JSON.stringify(Array.from(next))
        );
      } catch {}
      return next;
    });
  };


  const { data, isLoading: flowersLoading } = useFlowers({
    shopId: selectedShop,
    sortField,
    sortOrder,
    page,
    limit,
    isBouquet: bouquetsOnly ? true : undefined,
    minPrice: priceRange[0] || undefined,
    maxPrice: priceRange[1] || undefined,
  });

  const shouldPaginate = (data?.total || 0) > limit;

  const displayedFlowers = useMemo(() => {
    let list = (data?.data ?? []) as any[];
    if (favoritesOnly) list = list.filter((f) => favoriteIds.has(f._id));
    const fav: typeof list = [];
    const rest: typeof list = [];
    for (const f of list) (favoriteIds.has(f._id) ? fav : rest).push(f);
    return [...fav, ...rest];
  }, [data, favoriteIds, favoritesOnly]);


  const handleAddToCart = (flower: any, e: React.MouseEvent) => {
    addToCart({
      id: flower._id,
      name: flower.name,
      price: flower.price,
      quantity: 1,
      imageUrl: flower.imageUrl,
      shopId: flower.shopId,
    });
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const petal = document.createElement("div");
    petal.textContent = "🌸";
    Object.assign(petal.style, {
      position: "fixed",
      left: `${rect.left + rect.width / 2}px`,
      top: `${rect.top + rect.height / 2}px`,
      pointerEvents: "none",
      transition: "transform .7s cubic-bezier(.22,.68,0,1.71), opacity .7s",
      transform: "translate(-50%,-50%) scale(1)",
      opacity: "1",
    });
    document.body.appendChild(petal);
    requestAnimationFrame(() => {
      petal.style.transform = "translate(-50%,-140%) scale(0.6)";
      petal.style.opacity = "0";
    });
    setTimeout(() => petal.remove(), 750);
  };

  return (
    <Box ref={animRootRef as any}>
      <Typography
        variant="h5"
        sx={{ fontWeight: 700, mb: 2 }}
        className="fade-up"
      >
        Shop's
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 3 }}>
          <List className="fade-stagger">
            {shopsLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <ListItem key={i} sx={{ mb: 1 }}>
                    <Skeleton variant="rounded" width="100%" height={56} />
                  </ListItem>
                ))
              : shops?.map((shop) => (
                  <ListItem key={shop._id} disablePadding sx={{ mb: 1 }}>
                    <Box
                      sx={{
                        width: "100%",
                        borderRadius: 2,
                        border: "1px solid #f3e2e8",
                        background:
                          selectedShop === shop._id ? "#fff0f6" : "#fff",
                        transition: "background .2s, box-shadow .2s",
                        "&:hover": { boxShadow: 3 },
                      }}
                    >
                      <ListItemButton onClick={() => setSelectedShop(shop._id)}>
                        <ListItemText
                          primary={shop.name}
                          secondary={shop.address}
                          primaryTypographyProps={{
                            fontWeight: selectedShop === shop._id ? 700 : 500,
                          }}
                        />
                      </ListItemButton>
                    </Box>
                  </ListItem>
                ))}
          </List>
        </Grid>


        <Grid size={{ xs: 9 }}>
          {selectedShop && (
            <Box
              sx={{
                mb: 2,
                display: "flex",
                gap: 2,
                alignItems: "center",
                flexWrap: "wrap",
              }}
              className="fade-up"
            >
              <Select
                value={sortField}
                onChange={(e) => setSortField(e.target.value)}
                size="small"
              >
                <MenuItem value="price">By price</MenuItem>
                <MenuItem value="createdAt">By date</MenuItem>
              </Select>
              <Select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as any)}
                size="small"
              >
                <MenuItem value="asc">Ascending</MenuItem>
                <MenuItem value="desc">Descending</MenuItem>
              </Select>
              <FormControlLabel
                control={
                  <Switch
                    checked={bouquetsOnly}
                    onChange={(e) => setBouquetsOnly(e.target.checked)}
                  />
                }
                label="Bouquets only"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={favoritesOnly}
                    onChange={(e) => setFavoritesOnly(e.target.checked)}
                  />
                }
                label="Favorites only"
              />
              <Box sx={{ width: 220, px: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  Price range
                </Typography>
                <Slider
                  value={priceRange}
                  onChange={(_, v) => setPriceRange(v as number[])}
                  min={0}
                  max={2000}
                  step={10}
                  valueLabelDisplay="auto"
                />
              </Box>
              {shouldPaginate && (
                <Box sx={{ ml: "auto" }}>
                  <Pagination
                    count={data?.totalPages || 1}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                  />
                </Box>
              )}
            </Box>
          )}

          <Grid container spacing={2} className="fade-stagger">
            {flowersLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
                    <Skeleton variant="rounded" height={220} />
                  </Grid>
                ))
              : displayedFlowers.map((flower) => (
                  <Grid size={{ xs: 12, sm: 6, md: 4 }} key={flower._id}>
                    <Card
                      sx={{
                        position: "relative",
                        transition: "transform .15s ease, box-shadow .15s ease",
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: 6,
                        },
                      }}
                    >
                      <IconButton
                        aria-label={
                          favoriteIds.has(flower._id)
                            ? "Прибрати з улюблених"
                            : "Додати в улюблені"
                        }
                        onClick={() => toggleFavorite(flower._id)}
                        sx={{
                          position: "absolute",
                          bottom: 24,
                          right: 8,
                          zIndex: 2,
                          bgcolor: "rgba(255,255,255,0.8)",
                          backdropFilter: "blur(4px)",
                        }}
                      >
                        {favoriteIds.has(flower._id) ? (
                          <FavoriteIcon color="error" />
                        ) : (
                          <FavoriteBorderIcon />
                        )}
                      </IconButton>
                      {flower.imageUrl && (
                        <CardActionArea>
                          <img
                            src={`${API_BASE_URL}${flower.imageUrl}`}
                            alt={flower.name}
                            style={{
                              width: "100%",
                              aspectRatio: "4/3",
                              objectFit: "cover",
                              display: "block",
                            }}
                          />
                        </CardActionArea>
                      )}
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {flower.name}
                        </Typography>
                        <Typography color="text.secondary">
                          {flower.price} ₴
                        </Typography>
                        <Button
                          variant="contained"
                          sx={{ mt: 1, width: "85%" }}
                          onClick={(e) => handleAddToCart(flower, e)}
                        >
                          Add to cart
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
          </Grid>

          {selectedShop && shouldPaginate && (
            <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
              <Pagination
                count={data?.totalPages || 1}
                page={page}
                onChange={(_, value) => setPage(value)}
                color="primary"
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Box>
  );
}

export default ShopsPage;
