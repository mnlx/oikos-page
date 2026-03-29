import type { MouseEvent } from "react";
import ApartmentRoundedIcon from "@mui/icons-material/ApartmentRounded";
import BedRoundedIcon from "@mui/icons-material/BedRounded";
import CircleRoundedIcon from "@mui/icons-material/CircleRounded";
import ClearRoundedIcon from "@mui/icons-material/ClearRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PhotoLibraryRoundedIcon from "@mui/icons-material/PhotoLibraryRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import SquareFootRoundedIcon from "@mui/icons-material/SquareFootRounded";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Listing } from "../types";

type SortOrder = "featured" | "price-asc" | "price-desc" | "area-desc" | "recent";

type Props = {
  listings: Listing[];
  selectedId: number | null;
  onSelect: (listing: Listing) => void;
  isLoading: boolean;
  activeFilterCount: number;
  onClearFilters: () => void;
  filters: {
    priceMin: string;
    priceMax: string;
    minArea: string;
    minBedrooms: string;
    transactionType: "all" | "rent" | "sale";
    sortOrder: SortOrder;
    propertyTypeFilters: {
      apartment: boolean;
      house: boolean;
    };
  };
  onFiltersChange: {
    setPriceMin: (value: string) => void;
    setPriceMax: (value: string) => void;
    setMinArea: (value: string) => void;
    setMinBedrooms: (value: string) => void;
    setTransactionType: (value: "all" | "rent" | "sale") => void;
    setSortOrder: (value: SortOrder) => void;
    setPropertyTypeFilters: (value: { apartment: boolean; house: boolean }) => void;
  };
};

function money(value: number | null | undefined): string {
  if (value == null) {
    return "Consulte";
  }
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
}

function activeFilterLabels(filters: Props["filters"]): string[] {
  const labels: string[] = [];

  if (filters.transactionType === "rent") labels.push("Locacao");
  if (filters.transactionType === "sale") labels.push("Venda");
  if (!filters.propertyTypeFilters.apartment || !filters.propertyTypeFilters.house) {
    const types = [];
    if (filters.propertyTypeFilters.apartment) types.push("apartamentos");
    if (filters.propertyTypeFilters.house) types.push("casas");
    labels.push(`Tipos: ${types.join(" + ")}`);
  }
  if (filters.priceMin) labels.push(`Min ${money(Number(filters.priceMin))}`);
  if (filters.priceMax) labels.push(`Max ${money(Number(filters.priceMax))}`);
  if (filters.minArea) labels.push(`${filters.minArea} m²+`);
  if (filters.minBedrooms) labels.push(`${filters.minBedrooms}+ quartos`);
  if (filters.sortOrder !== "featured") {
    const sortLabels: Record<SortOrder, string> = {
      featured: "Destaque",
      "price-asc": "Menor preco",
      "price-desc": "Maior preco",
      "area-desc": "Maior area",
      recent: "Mais recentes",
    };
    labels.push(sortLabels[filters.sortOrder]);
  }

  return labels;
}

export function ListingList({
  listings,
  selectedId,
  onSelect,
  isLoading,
  activeFilterCount,
  onClearFilters,
  filters,
  onFiltersChange,
}: Props) {
  const propertySelection = Object.entries(filters.propertyTypeFilters)
    .filter(([, enabled]) => enabled)
    .map(([value]) => value);
  const filterLabels = activeFilterLabels(filters);

  function handlePropertyChange(_event: MouseEvent<HTMLElement>, values: string[]) {
    onFiltersChange.setPropertyTypeFilters({
      apartment: values.includes("apartment"),
      house: values.includes("house"),
    });
  }

  return (
    <Paper
      component="aside"
      className="listing-pane"
      sx={{
        borderRadius: { xs: 0, lg: 1 },
        bgcolor: "background.paper",
        color: "text.primary",
      }}
    >
      <Box
        sx={{
          display: "grid",
          gridTemplateRows: "auto auto minmax(0, 1fr)",
          gap: 1,
          height: "100%",
          p: 1,
          minHeight: 0,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            px: 1.4,
            py: 1.2,
            borderRadius: 0.75,
            bgcolor: "background.paper",
            color: "text.primary",
          }}
        >
          <Stack spacing={0.5}>
            <Typography variant="overline" sx={{ color: "text.secondary", fontSize: "0.58rem" }}>
              Caderno curado
            </Typography>
            <Typography variant="h2" sx={{ fontSize: "2rem", lineHeight: 0.92 }}>
              Oikos
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {listings.length} imoveis na lista
            </Typography>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            p: 1.1,
            borderRadius: 0.75,
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box>
              <Typography variant="overline" color="primary.main">
                Filtros
              </Typography>
            </Box>
            <Button
              size="small"
              variant="text"
              color="inherit"
              startIcon={<ClearRoundedIcon />}
              onClick={onClearFilters}
              disabled={activeFilterCount === 0}
              sx={{ color: "text.secondary", minWidth: "auto", px: 0.5 }}
            >
              Limpar
            </Button>
          </Stack>

          <Stack spacing={1.25} sx={{ mt: 1.25 }}>
            <ToggleButtonGroup
              exclusive
              value={filters.transactionType}
              onChange={(_event, value: Props["filters"]["transactionType"] | null) => {
                if (value) {
                  onFiltersChange.setTransactionType(value);
                }
              }}
              fullWidth
              color="primary"
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  flex: 1,
                },
              }}
            >
              <ToggleButton value="all">Todos</ToggleButton>
              <ToggleButton value="rent">Locacao</ToggleButton>
              <ToggleButton value="sale">Venda</ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              value={propertySelection}
              onChange={handlePropertyChange}
              fullWidth
              color="primary"
              size="small"
              sx={{
                "& .MuiToggleButton-root": {
                  flex: 1,
                },
              }}
            >
              <ToggleButton value="apartment">
                <ApartmentRoundedIcon fontSize="small" sx={{ mr: 1 }} />
                Aptos
              </ToggleButton>
              <ToggleButton value="house">
                <HomeRoundedIcon fontSize="small" sx={{ mr: 1 }} />
                Casas
              </ToggleButton>
            </ToggleButtonGroup>

            <ToggleButtonGroup
              exclusive
              value={filters.sortOrder}
              onChange={(_event, value: SortOrder | null) => {
                if (value) {
                  onFiltersChange.setSortOrder(value);
                }
              }}
              fullWidth
              color="primary"
              size="small"
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
                "& .MuiToggleButton-root": {
                  minWidth: 0,
                  px: 0.5,
                  fontSize: "0.72rem",
                },
              }}
            >
              <ToggleButton value="featured">Destaque</ToggleButton>
              <ToggleButton value="recent">Recentes</ToggleButton>
              <ToggleButton value="price-asc">Menor</ToggleButton>
              <ToggleButton value="price-desc">Maior</ToggleButton>
              <ToggleButton value="area-desc">Area</ToggleButton>
            </ToggleButtonGroup>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 1,
              }}
            >
              <TextField
                label="Preço mín."
                type="number"
                value={filters.priceMin}
                onChange={(event) => onFiltersChange.setPriceMin(event.target.value)}
                placeholder="R$ 0"
                size="small"
              />
              <TextField
                label="Preço máx."
                type="number"
                value={filters.priceMax}
                onChange={(event) => onFiltersChange.setPriceMax(event.target.value)}
                placeholder="Sem limite"
                size="small"
              />
              <TextField
                label="Área mín."
                type="number"
                value={filters.minArea}
                onChange={(event) => onFiltersChange.setMinArea(event.target.value)}
                placeholder="65"
                size="small"
              />
              <TextField
                label="Quartos mín."
                type="number"
                value={filters.minBedrooms}
                onChange={(event) => onFiltersChange.setMinBedrooms(event.target.value)}
                placeholder="2"
                size="small"
              />
            </Box>

            {filterLabels.length > 0 && (
              <>
                <Divider sx={{ borderColor: alpha("#201a12", 0.08) }} />
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {filterLabels.map((label) => (
                    <Chip key={label} size="small" label={label} />
                  ))}
                </Stack>
              </>
            )}
          </Stack>
        </Paper>

        <Stack spacing={0.75} className="listing-list" sx={{ pb: 0.5, flex: 1, minHeight: 0 }}>
          {isLoading &&
            Array.from({ length: 5 }).map((_, index) => (
              <Paper
                key={index}
                elevation={0}
                sx={{
                  p: 1.5,
                  borderRadius: 0.5,
                  bgcolor: alpha("#ffffff", 0.72),
                }}
              >
                <Stack direction="row" spacing={1.5}>
                  <Skeleton variant="rounded" width={108} height={96} />
                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Skeleton variant="text" width="30%" height={18} />
                    <Skeleton variant="text" width="76%" height={28} />
                    <Skeleton variant="text" width="42%" height={18} />
                    <Stack direction="row" spacing={1}>
                      <Skeleton variant="rounded" width={76} height={26} />
                      <Skeleton variant="rounded" width={88} height={26} />
                    </Stack>
                  </Stack>
                </Stack>
              </Paper>
            ))}

          {!isLoading &&
            listings.map((listing) => {
              const isSelected = selectedId === listing.id;
              const price = listing.price_rent ?? listing.price_sale;
              const PropertyIcon = listing.property_type === "apartment" ? ApartmentRoundedIcon : HomeRoundedIcon;

              return (
                <Card
                  key={listing.id}
                  elevation={0}
                  sx={{
                    borderRadius: 0.5,
                    minHeight: 112,
                    display: "flex",
                    overflow: "hidden",
                    bgcolor: isSelected ? alpha("#ffffff", 1) : alpha("#f8fafc", 0.92),
                    border: "1px solid",
                    borderColor: isSelected ? alpha("#4b5563", 0.2) : alpha("#111827", 0.06),
                    boxShadow: isSelected ? "0 8px 18px rgba(15, 23, 42, 0.05)" : "none",
                    transition: "box-shadow 180ms ease, border-color 180ms ease",
                  }}
                >
                  <CardActionArea onClick={() => onSelect(listing)} sx={{ p: 1.1, display: "flex", width: "100%" }}>
                    <Stack direction="row" spacing={1} alignItems="stretch" sx={{ width: "100%" }}>
                      <Box
                        sx={{
                          width: 56,
                          minWidth: 56,
                          display: "grid",
                          placeItems: "center",
                          borderRadius: 0.25,
                          bgcolor: alpha("#e5e7eb", 0.95),
                          color: "text.secondary",
                        }}
                      >
                        <PropertyIcon sx={{ fontSize: 28 }} />
                      </Box>

                      <Stack spacing={0.6} sx={{ minWidth: 0, flex: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "center" }}>
                          <Stack direction="row" spacing={0.75} alignItems="center" sx={{ minWidth: 0 }}>
                            <CircleRoundedIcon sx={{ fontSize: 9, color: isSelected ? "#6b7280" : "#9ca3af" }} />
                            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
                              {listing.transaction_type === "rent" ? "Locacao" : listing.transaction_type === "sale" ? "Venda" : listing.transaction_type}
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                            {listing.source_name}
                          </Typography>
                        </Box>

                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, alignItems: "flex-start" }}>
                          <Box sx={{ minWidth: 0, flex: 1 }}>
                            <Typography
                              sx={{
                                color: "text.primary",
                                fontWeight: 800,
                                lineHeight: 1.15,
                                fontSize: "0.95rem",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {listing.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              sx={{
                                mt: 0.35,
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {[listing.neighborhood, listing.city].filter(Boolean).join(" • ")}
                            </Typography>
                          </Box>
                          <Box sx={{ minWidth: 88, textAlign: "right" }}>
                            <Typography sx={{ color: "primary.dark", fontWeight: 900, lineHeight: 1.1, fontSize: "0.95rem" }}>
                              {money(price)}
                            </Typography>
                          </Box>
                        </Box>

                        <Stack direction="row" spacing={0.75} useFlexGap flexWrap="wrap">
                          <Chip
                            size="small"
                            icon={<PropertyIcon />}
                            label={listing.property_type === "apartment" ? "Apartamento" : "Casa"}
                            sx={{ bgcolor: alpha("#64748b", 0.1), color: "var(--oikos-blue)" }}
                          />
                          <Chip
                            size="small"
                            icon={<SquareFootRoundedIcon />}
                            label={listing.area_m2 ? `${listing.area_m2} m²` : "Área n/d"}
                            sx={{ bgcolor: alpha("#64748b", 0.1), color: "var(--oikos-teal)" }}
                          />
                          <Chip
                            size="small"
                            icon={<BedRoundedIcon />}
                            label={listing.bedrooms ? `${listing.bedrooms} qts` : "qts n/d"}
                            sx={{ bgcolor: alpha("#64748b", 0.1), color: "var(--oikos-coral)" }}
                          />
                          {listing.image_count > 0 && (
                            <Chip
                              size="small"
                              variant="outlined"
                              icon={<PhotoLibraryRoundedIcon />}
                              label={`${listing.image_count} imagens`}
                            />
                          )}
                        </Stack>
                      </Stack>
                    </Stack>
                  </CardActionArea>
                </Card>
              );
            })}

          {!isLoading && listings.length === 0 && (
            <Paper
              elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 0.5,
                  textAlign: "center",
                  bgcolor: alpha("#ffffff", 0.92),
                }}
            >
              <Typography variant="h6" sx={{ mb: 1 }}>
                Nenhum resultado
              </Typography>
              <Typography color="text.secondary">
                Ajuste os filtros para ampliar a busca e recuperar mais imoveis.
              </Typography>
            </Paper>
          )}
        </Stack>
      </Box>
    </Paper>
  );
}
