import { alpha, createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#4b5563",
      light: "#6b7280",
      dark: "#1f2937",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#6b7280",
      light: "#9ca3af",
      dark: "#374151",
    },
    background: {
      default: "#edf0f3",
      paper: "#ffffff",
    },
    text: {
      primary: "#111827",
      secondary: "#6b7280",
    },
    divider: alpha("#111827", 0.12),
    success: {
      main: "#4b5563",
    },
    info: {
      main: "#64748b",
    },
  },
  shape: {
    borderRadius: 4,
  },
  typography: {
    fontFamily: '"Bricolage Grotesque", "Segoe UI", sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },
    h3: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 700,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 700,
    },
    h5: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 700,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: "0.01em",
    },
    overline: {
      letterSpacing: "0.26em",
      fontWeight: 700,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ":root": {
          "--oikos-gold": "#4b5563",
          "--oikos-gold-soft": "#d1d5db",
          "--oikos-white": "#ffffff",
          "--oikos-surface": "#f8fafc",
          "--oikos-surface-muted": "#eef2f7",
          "--oikos-text": "#111827",
          "--oikos-text-muted": "#6b7280",
          "--oikos-coral": "#6b7280",
          "--oikos-teal": "#4b5563",
          "--oikos-blue": "#64748b",
          "--oikos-green": "#6b7280",
        },
        html: {
          scrollBehavior: "smooth",
        },
        body: {
          background: "#f3f4f6",
          color: "#111827",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: `1px solid ${alpha("#111827", 0.08)}`,
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#ffffff", 0.98),
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#111827", 0.08),
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#4b5563", 0.32),
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: alpha("#4b5563", 0.72),
            boxShadow: `0 0 0 4px ${alpha("#cbd5e1", 0.45)}`,
          },
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderColor: alpha("#111827", 0.08),
          color: "#4b5563",
          backgroundColor: alpha("#ffffff", 0.95),
          "&.Mui-selected": {
            background: "#e5e7eb",
            color: "#111827",
            borderColor: alpha("#4b5563", 0.32),
          },
          "&.Mui-selected:hover": {
            background: "#e5e7eb",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: alpha("#64748b", 0.1),
          color: "#475569",
          borderRadius: 999,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        contained: {
          background: "#374151",
          boxShadow: "0 10px 24px rgba(15, 23, 42, 0.14)",
          "&:hover": {
            background: "#2f3946",
          },
        },
        outlined: {
          borderColor: alpha("#111827", 0.12),
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },
  },
});
