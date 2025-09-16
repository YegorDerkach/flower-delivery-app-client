import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#e91e63", 
      light: "#ff6090",
      dark: "#b0003a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#81c784", 
      light: "#b2fab4",
      dark: "#519657",
      contrastText: "#0b1b0f",
    },
    background: {
      default: "#fff8fb",
      paper: "#ffffff",
    },
    text: {
      primary: "#2a2a2a",
      secondary: "#6b6b6b",
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: [
      "Poppins",
      "-apple-system",
      "BlinkMacSystemFont",
      "Segoe UI",
      "Roboto",
      "Helvetica Neue",
      "Arial",
      "sans-serif",
    ].join(","),
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "linear-gradient(90deg, #ffe3ec 0%, #fff 100%)",
          color: "#b0003a",
          boxShadow: "none",
          borderBottom: "1px solid #f6d9e4",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 999,
        },
        containedPrimary: {
          boxShadow: "0 6px 16px rgba(233, 30, 99, 0.25)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
          border: "1px solid #f3e2e8",
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingBottom: 24,
        },
      },
    },
  },
});

export default theme;
