import BathtubRoundedIcon from "@mui/icons-material/BathtubRounded";
import BedRoundedIcon from "@mui/icons-material/BedRounded";
import BoltRoundedIcon from "@mui/icons-material/BoltRounded";
import DirectionsCarRoundedIcon from "@mui/icons-material/DirectionsCarRounded";
import LaunchRoundedIcon from "@mui/icons-material/LaunchRounded";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import ScheduleRoundedIcon from "@mui/icons-material/ScheduleRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Listing, Summary } from "../types";

type Props = {
  listing: Listing | null;
  summary: Summary | null;
  isLoading: boolean;
};

function dateLabel(value: string | null | undefined): string {
  if (!value) {
    return "n/d";
  }
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

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

function MetaLine({ label, value }: { label: string; value: string }) {
  return (
    <Stack spacing={0.3}>
      <Typography variant="overline" sx={{ color: "text.secondary", fontSize: "0.62rem" }}>
        {label}
      </Typography>
      <Typography sx={{ color: "text.primary", fontWeight: 600 }}>{value}</Typography>
    </Stack>
  );
}

function moneyPerSquareMeter(listing: Listing): string | null {
  const price = listing.price_rent ?? listing.price_sale;
  if (!price || !listing.area_m2) {
    return null;
  }

  return money(Math.round(price / listing.area_m2));
}

export function DetailsPanel({ listing, summary, isLoading }: Props) {
  if (isLoading && !listing) {
    return (
      <Paper className="details-pane section-card" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 1.25 }}>
        <Stack spacing={2.5}>
          <Skeleton variant="text" width="22%" height={20} />
          <Skeleton variant="text" width="74%" height={60} />
          <Skeleton variant="rounded" width="100%" height={148} />
          <Stack direction="row" spacing={1}>
            <Skeleton variant="rounded" width={96} height={32} />
            <Skeleton variant="rounded" width={110} height={32} />
            <Skeleton variant="rounded" width={92} height={32} />
          </Stack>
          <Skeleton variant="text" width="100%" height={24} />
          <Skeleton variant="text" width="100%" height={24} />
          <Skeleton variant="text" width="85%" height={24} />
        </Stack>
      </Paper>
    );
  }

  if (!listing) {
    return (
      <Paper className="details-pane section-card" sx={{ p: 3, display: "grid", placeItems: "center", borderRadius: 1.25 }}>
        <Typography color="text.secondary">
          Ajuste os filtros ou escolha outro imovel para montar o dossie.
        </Typography>
      </Paper>
    );
  }

  const price = listing.price_rent ?? listing.price_sale;
  const pricePerSquareMeter = moneyPerSquareMeter(listing);

  return (
    <Paper
      className="details-pane section-card"
      sx={{
        p: { xs: 3, md: 4 },
        borderRadius: 1.25,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2}>
        <Stack
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", md: "center" },
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography variant="overline" color="primary.main">
              Dossie do imovel
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: "2.35rem", md: "3.4rem" }, lineHeight: 0.92, maxWidth: 820 }}>
              {listing.title}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap" sx={{ mt: 1.4 }}>
              <LocationOnOutlinedIcon color="primary" fontSize="small" />
              <Typography color="text.secondary">
                {[listing.address, listing.neighborhood, `${listing.city}/${listing.state}`].filter(Boolean).join(" • ")}
              </Typography>
            </Stack>
          </Box>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
            <Button
              component="a"
              href={listing.canonical_url}
              target="_blank"
              rel="noreferrer"
              variant="contained"
              endIcon={<LaunchRoundedIcon />}
            >
              Abrir anúncio
            </Button>
            <Button
              variant="outlined"
              color="secondary"
              startIcon={<ScheduleRoundedIcon />}
              disabled
              sx={{ justifyContent: "flex-start" }}
            >
              {isLoading ? "Atualizando..." : "Dossie sincronizado"}
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", xl: "1.45fr 0.8fr" },
            gap: 2,
            alignItems: "start",
          }}
        >
          <Stack spacing={2.25}>
            <Paper
              elevation={0}
              sx={{
                p: 2.3,
                borderRadius: 0.75,
                bgcolor: "#f8fafc",
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
                <Box>
                  <Typography variant="overline" color="primary.main">
                    Ticket principal
                  </Typography>
                  <Typography variant="h3" sx={{ mt: 0.35 }}>
                    {money(price)}
                  </Typography>
                </Box>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                  <MetaLine
                    label="Transacao"
                    value={listing.transaction_type === "rent" ? "Locacao" : listing.transaction_type === "sale" ? "Venda" : listing.transaction_type}
                  />
                  <MetaLine label="Fonte" value={listing.source_name} />
                  <MetaLine label="Preco por m²" value={pricePerSquareMeter ?? "n/d"} />
                </Stack>
              </Stack>
            </Paper>

            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
              <Chip
                label={listing.property_type === "apartment" ? "Apartamento" : "Casa"}
                sx={{ textTransform: "capitalize", bgcolor: alpha("#2f80ed", 0.1), color: "var(--oikos-blue)" }}
              />
              <Chip icon={<BedRoundedIcon />} label={`${listing.bedrooms ?? "n/d"} quartos`} sx={{ bgcolor: alpha("#ee6c4d", 0.1), color: "var(--oikos-coral)" }} />
              <Chip icon={<BathtubRoundedIcon />} label={`${listing.bathrooms ?? "n/d"} banheiros`} sx={{ bgcolor: alpha("#238b8f", 0.1), color: "var(--oikos-teal)" }} />
              <Chip icon={<DirectionsCarRoundedIcon />} label={`${listing.parking_spaces ?? "n/d"} vagas`} sx={{ bgcolor: alpha("#1f9d68", 0.1), color: "var(--oikos-green)" }} />
              <Chip
                icon={<StraightenRoundedIcon />}
                label={listing.area_m2 ? `${listing.area_m2} m²` : "Área n/d"}
                sx={{ bgcolor: alpha("#be9448", 0.12), color: "primary.dark" }}
              />
            </Stack>

            <Paper elevation={0} sx={{ p: 1.6, borderRadius: 0.75, bgcolor: alpha("#f8fafc", 0.92) }}>
              <Typography variant="overline" color="primary.main">
                Leitura do anuncio
              </Typography>
              <Typography color="text.secondary" sx={{ lineHeight: 1.9, mt: 1.15 }}>
                {listing.description ?? "Sem descricao disponivel para este imovel."}
              </Typography>
            </Paper>

            <Paper elevation={0} sx={{ p: 1.6, borderRadius: 0.75, bgcolor: alpha("#f8fafc", 0.92) }}>
              <Typography variant="overline" color="primary.main">
                Linha do tempo
              </Typography>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" },
                  gap: 1.5,
                  mt: 1.35,
                }}
              >
                <MetaLine label="Publicado" value={dateLabel(listing.published_at)} />
                <MetaLine label="Primeira aparicao" value={dateLabel(listing.first_seen_at)} />
                <MetaLine label="Ultimo scrape" value={dateLabel(listing.last_scraped_at)} />
              </Box>
            </Paper>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              p: 2.5,
              borderRadius: 0.75,
              bgcolor: "#f8fafc",
            }}
          >
            <Typography variant="overline" color="primary.main">
              Painel operacional
            </Typography>
            <Divider sx={{ my: 1.5 }} />
            <Stack spacing={1.4}>
              <MetaLine label="Broker" value={listing.broker_name ?? "n/d"} />
              <MetaLine label="Ultima execucao" value={dateLabel(summary?.latest_scrape_finished_at)} />
              <MetaLine label="Status" value={summary?.latest_scrape_status ?? "n/d"} />
              <MetaLine label="Condominio" value={money(listing.condo_fee)} />
              <MetaLine label="IPTU" value={money(listing.iptu)} />
            </Stack>
            <Box
              sx={{
                mt: 2.25,
                p: 1.6,
                borderRadius: 0.75,
                bgcolor: alpha("#f3f4f6", 0.92),
                display: "grid",
                gap: 1,
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <BoltRoundedIcon sx={{ color: "primary.dark" }} />
                <Typography variant="body2" sx={{ color: "text.primary", fontWeight: 700 }}>
                  Leitura de mercado
                </Typography>
              </Stack>
              <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
                {summary?.active_listing_count ?? 0} ativos acompanhados em {summary?.source_count ?? 0} fontes. O painel
                esta preparado para leitura rapida antes da visita ao anuncio original.
              </Typography>
            </Box>
          </Paper>
        </Box>
      </Stack>
    </Paper>
  );
}
