import { createTheme } from "@mui/material/styles";

const sharedPalette = {
  primary: "rgb(225, 160, 20)", // #e1a014
  secondary: "rgb(137, 88, 176)", // #8958b0
  fontFamily: '"Fira Sans", sans-serif',
};

export const getTheme = (mode: "light" | "dark") =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: sharedPalette.primary,
      },
      secondary: {
        main: sharedPalette.secondary,
      },
      background: {
        default: mode === "light" ? "rgb(252, 252, 252)" : "rgb(13, 8, 17)",
        paper: mode === "light" ? "rgb(255, 255, 255)" : "rgb(27, 17, 35)",
      },
      text: {
        primary: mode === "light" ? "rgb(0, 0, 0)" : "rgb(230, 230, 230)",
        secondary:
          mode === "light" ? "rgb(100, 100, 100)" : "rgb(200, 200, 200)",
      },
    },
    typography: {
      fontFamily: sharedPalette.fontFamily,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "lowercase",
            borderRadius: "8px",
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            boxShadow:
              mode === "light"
                ? "rgba(176, 148, 88, 0.2) 0 7px 29px 0"
                : "rgba(176, 148, 88, 0.25) 5px 5px 15px 0px",
          },
        },
      },
    },
  });
