import { useCallback, useEffect, useState } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import KeyboardArrowLeftRoundedIcon from "@mui/icons-material/KeyboardArrowLeftRounded";
import KeyboardArrowRightRoundedIcon from "@mui/icons-material/KeyboardArrowRightRounded";
import OpenInFullRoundedIcon from "@mui/icons-material/OpenInFullRounded";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import type { Listing } from "../types";

type Props = {
  listing: Listing | null;
  isLoading: boolean;
};

export function GalleryPanel({ listing, isLoading }: Props) {
  const [carouselIndex, setCarouselIndex] = useState<number | null>(null);
  const images = listing?.image_uris ?? [];

  const close = useCallback(() => setCarouselIndex(null), []);

  const prev = useCallback(() => {
    setCarouselIndex((i) => (i == null ? null : (i - 1 + images.length) % images.length));
  }, [images.length]);

  const next = useCallback(() => {
    setCarouselIndex((i) => (i == null ? null : (i + 1) % images.length));
  }, [images.length]);

  useEffect(() => {
    if (carouselIndex == null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [carouselIndex, close, prev, next]);

  useEffect(() => {
    setCarouselIndex(null);
  }, [listing?.id]);

  if (isLoading && !listing) {
    return (
      <Paper className="gallery-pane section-card" sx={{ p: { xs: 2, md: 2.5 }, borderRadius: 1.25 }}>
        <Stack spacing={1.5}>
          <Skeleton variant="text" width="18%" height={18} />
          <Skeleton variant="text" width="38%" height={42} />
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.5fr) minmax(260px, 0.78fr)" },
              gap: 1.25,
            }}
          >
            <Skeleton variant="rounded" width="100%" height={460} />
            <Stack spacing={1.25}>
              <Skeleton variant="rounded" width="100%" height={145} />
              <Skeleton variant="rounded" width="100%" height={145} />
              <Skeleton variant="rounded" width="100%" height={145} />
            </Stack>
          </Box>
        </Stack>
      </Paper>
    );
  }

  if (!listing) {
    return (
      <Paper className="gallery-pane section-card" sx={{ p: 3, display: "grid", placeItems: "center", borderRadius: 1.25 }}>
        <Typography color="text.secondary">Selecione um anuncio para abrir a galeria.</Typography>
      </Paper>
    );
  }

  if (images.length === 0) {
    return (
      <Paper className="gallery-pane section-card" sx={{ p: 3, display: "grid", placeItems: "center", borderRadius: 1.25 }}>
        <Typography color="text.secondary">Sem imagens disponiveis para este anuncio.</Typography>
      </Paper>
    );
  }

  const spotlightImage = images[0];
  const secondaryImages = images.slice(1, 5);

  return (
    <Paper
      className="gallery-pane section-card"
      sx={{
        p: { xs: 2.5, md: 3 },
        borderRadius: 1.25,
        bgcolor: "background.paper",
      }}
    >
      <Stack
        direction={{ xs: "column", lg: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", lg: "flex-end" }}
        sx={{ mb: 1.5 }}
      >
        <Box>
          <Typography variant="overline" color="primary.main">
            Sequencia visual
          </Typography>
          <Typography variant="h3" sx={{ fontSize: { xs: "2rem", md: "2.4rem" }, mt: 0.2 }}>
            Galeria principal
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 700 }}>
            A leitura comeca pela imagem. Abra a sequencia completa para entender luz, volumetria e acabamento antes de
            entrar nos dados tecnicos.
          </Typography>
        </Box>
        <Button variant="outlined" endIcon={<OpenInFullRoundedIcon />} onClick={() => setCarouselIndex(0)}>
          Abrir tela cheia
        </Button>
      </Stack>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1.55fr) minmax(320px, 0.84fr)" },
          gap: 1.25,
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={() => setCarouselIndex(0)}
          sx={{
            all: "unset",
            position: "relative",
            overflow: "hidden",
            borderRadius: 0.75,
            minHeight: { xs: 340, md: 520 },
            cursor: "pointer",
            border: "1px solid",
            borderColor: alpha("#171717", 0.08),
            backgroundImage: `linear-gradient(180deg, rgba(8,8,8,0.04) 0%, rgba(8,8,8,0.44) 100%), url(${spotlightImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            boxShadow: "0 28px 60px rgba(32, 23, 15, 0.12)",
            transition: "transform 220ms ease, box-shadow 220ms ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 34px 72px rgba(32, 23, 15, 0.16)",
            },
            "&:focus-visible": {
              outline: `3px solid ${alpha("#b97c31", 0.5)}`,
              outlineOffset: 4,
            },
          }}
        >
          <Box
            sx={{
              position: "absolute",
              left: 22,
              right: 22,
              bottom: 22,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              alignItems: "flex-end",
            }}
          >
            <Box>
              <Typography variant="overline" sx={{ color: alpha("#fff9f1", 0.8) }}>
                {listing.image_count} imagens disponiveis
              </Typography>
              <Typography variant="h4" sx={{ color: "#fff8ef", maxWidth: 420 }}>
                Vista principal do imovel
              </Typography>
            </Box>
            <Box
              sx={{
                px: 1.2,
                py: 0.9,
                borderRadius: 0.5,
                bgcolor: alpha("#ffffff", 0.2),
                border: "1px solid",
                borderColor: alpha("#ffffff", 0.22),
                color: "#fff8ef",
                backdropFilter: "blur(10px)",
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Abrir sequencia
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", xl: "1fr" },
            gridAutoRows: { xl: "1fr" },
            gap: 1.25,
          }}
        >
          {secondaryImages.map((uri, index) => {
            const absoluteIndex = index + 1;
            const isLastVisible = absoluteIndex === 4 && images.length > 5;

            return (
              <Box
                key={uri}
                component="button"
                type="button"
                onClick={() => setCarouselIndex(absoluteIndex)}
                sx={{
                  all: "unset",
                  position: "relative",
                  minHeight: { xs: 150, xl: 122 },
                  borderRadius: 0.5,
                  overflow: "hidden",
                  cursor: "pointer",
                  border: "1px solid",
                  borderColor: alpha("#171717", 0.08),
                  backgroundImage: `linear-gradient(180deg, rgba(8,8,8,0.05) 0%, rgba(8,8,8,0.46) 100%), url(${uri})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  transition: "transform 200ms ease",
                  "&:hover": {
                    transform: "translateY(-2px)",
                  },
                  "&:focus-visible": {
                    outline: `3px solid ${alpha("#b97c31", 0.5)}`,
                    outlineOffset: 4,
                  },
                }}
              >
                {isLastVisible && (
                  <Box
                    sx={{
                      position: "absolute",
                      inset: 0,
                      display: "grid",
                      placeItems: "center",
                      bgcolor: alpha("#101010", 0.42),
                    }}
                  >
                    <Typography variant="h4" sx={{ color: "#fffaf3" }}>
                      +{images.length - 5}
                    </Typography>
                  </Box>
                )}
                <Typography
                  variant="body2"
                  sx={{
                    position: "absolute",
                    left: 12,
                    bottom: 10,
                    color: "rgba(255,250,243,0.9)",
                    fontWeight: 700,
                  }}
                >
                  Foto {absoluteIndex + 1}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {carouselIndex != null && (
        <Dialog
          open
          onClose={close}
          maxWidth="lg"
          PaperProps={{
            sx: {
              width: "min(1100px, calc(100vw - 32px))",
              bgcolor: alpha("#18120c", 0.94),
              color: "common.white",
              borderRadius: 0.75,
            },
          }}
        >
          <Box sx={{ position: "relative", p: { xs: 2, md: 3 } }}>
            <IconButton
              onClick={close}
              aria-label="Fechar"
              sx={{ position: "absolute", top: 12, right: 12, color: "common.white", zIndex: 1 }}
            >
              <CloseRoundedIcon />
            </IconButton>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <IconButton onClick={prev} aria-label="Anterior" sx={{ color: "common.white" }}>
                <KeyboardArrowLeftRoundedIcon />
              </IconButton>
              <Box
                component="img"
                key={carouselIndex}
                src={images[carouselIndex]}
                alt={`Foto ${carouselIndex + 1}`}
                sx={{
                  width: "100%",
                  maxHeight: "78vh",
                  objectFit: "contain",
                  borderRadius: 0.5,
                }}
              />
              <IconButton onClick={next} aria-label="Próxima" sx={{ color: "common.white" }}>
                <KeyboardArrowRightRoundedIcon />
              </IconButton>
            </Box>
            <Typography align="center" sx={{ mt: 1.5, color: alpha("#fff7ea", 0.78) }}>
              {carouselIndex + 1} / {images.length}
            </Typography>
          </Box>
        </Dialog>
      )}
    </Paper>
  );
}
