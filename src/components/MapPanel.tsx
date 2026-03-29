import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { Box, Paper, Skeleton, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Listing } from "../types";

type Props = {
  listing: Listing | null;
  isLoading: boolean;
};

function mapUrl(listing: Listing): string {
  const bbox = [
    (listing.longitude ?? -48.55) - 0.03,
    (listing.latitude ?? -27.6) - 0.02,
    (listing.longitude ?? -48.55) + 0.03,
    (listing.latitude ?? -27.6) + 0.02,
  ].join("%2C");
  const marker = `${listing.latitude ?? -27.6}%2C${listing.longitude ?? -48.55}`;
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`;
}

export function MapPanel({ listing, isLoading }: Props) {
  return (
    <Paper
      className="map-pane section-card"
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 1.25,
        bgcolor: "background.paper",
      }}
    >
      <Stack spacing={2} sx={{ height: "100%" }}>
        <Box>
          <Typography variant="overline" color="primary.main">
            Implantacao
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <PlaceOutlinedIcon color="primary" fontSize="small" />
            <Typography color="text.secondary">
              {listing?.address ?? listing?.neighborhood ?? "Localizacao aproximada"}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            p: 1.3,
            borderRadius: 0.75,
            bgcolor: alpha("#f8fafc", 0.9),
            border: "1px solid",
            borderColor: alpha("#111827", 0.06),
          }}
        >
          <Typography variant="body2" sx={{ color: "text.secondary", lineHeight: 1.7 }}>
            Use o mapa para validar contexto urbano, eixo de bairro e proximidade visual antes de abrir o anuncio.
          </Typography>
        </Box>
        <Box
          sx={{
            height: "100%",
            minHeight: 320,
            borderRadius: 0.75,
            overflow: "hidden",
            border: "1px solid",
            borderColor: alpha("#171717", 0.07),
            bgcolor: "background.paper",
            position: "relative",
          }}
        >
          {isLoading && !listing ? <Skeleton variant="rounded" width="100%" height="100%" sx={{ minHeight: 320 }} /> : null}
          {listing ? (
            <Box
              component="iframe"
              title="listing-map"
              src={mapUrl(listing)}
              loading="lazy"
              sx={{ width: "100%", height: "100%", minHeight: 320, border: 0 }}
            />
          ) : (
            <Box sx={{ display: "grid", placeItems: "center", minHeight: 320, px: 3 }}>
              <Typography color="text.secondary" align="center">
                Selecione uma listagem com coordenadas para ver o mapa.
              </Typography>
            </Box>
          )}
        </Box>
      </Stack>
    </Paper>
  );
}
