//Entry point for the webpack and deals with the routes
import React from "react";
import ReactDOM from "react-dom/client";
import WebRoute from "./utils/router";
import { ThemeProvider, responsiveFontSizes, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "index.css";
import { useMetadataContext } from "context/MetadataContext";
import MetadataProvider from "provider/MetadataProvider";
import { SnackbarProvider } from "notistack";
import MyriadPro from "assets/MYRIADPRO-REGULAR.woff";
import MyriadProBold from "assets/MYRIADPRO-BOLD.woff";

//context: https://github.com/vasturiano/react-force-graph/issues/409

let theme = createTheme({
  typography: {
    fontFamily: ['"Myriad Pro"', "Helvetica Neue", "Roboto"].join(","),
    h1: {
      fontFamily: "Myriad Pro",
      letterSpacing: -0.5,
      textTransform: "uppercase",
    },
    h2: {
      fontFamily: "Myriad Pro Bold",
      letterSpacing: -1.2,
    },
    h3: {
      fontFamily: "Myriad Pro Bold",
      letterSpacing: -1.2,
    },
    h4: {
      fontFamily: "Myriad Pro Bold",
      letterSpacing: -1.2,
    },
    h5: {
      fontFamily: "Myriad Pro Bold",
      letterSpacing: -1.2,
    },
    h6: {
      fontFamily: "Myriad Pro Bold",
      letterSpacing: -1.2,
    },
    body1: {
      fontFamily: "Arial",
      fontWeight: 600,
      letterSpacing: -1,
    },

    body2: {
      fontFamily: "Arial",
    },
    button: {
      fontFamily: "Myriad Pro Bold",
      letterSpacing: -1,
      fontSize: "1.5rem",
    },
  },
  palette: {
    mode: "dark",
    background: {
      default: "#171717",
    },
    primary: {
      main: "#D9AA63",
    },
    secondary: {
      main: "#ffffff",
    },
    navyblue: {
      main: "#3477e3",
    },

    // secondary: {
    //   main: "rgb(255, 105, 127)",
    // },
    // normal: {
    //   main: "#2596be",
    // },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Myriad Pro';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Myriad Pro'), local('Myriad Pro-Regular'), url(${MyriadPro}) format('woff');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }

        @font-face {
          font-family: 'Myriad Pro Bold';
          font-style: normal;
          font-display: swap;
          font-weight: 400;
          src: local('Myriad Pro'), local('Myriad Pro-Bold'), url(${MyriadProBold}) format('woff');
          unicodeRange: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF;
        }

      `,
    },
    MuiButtonBase: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          borderRadius: "2rem",
        },
      },
    },
  },
});
theme = responsiveFontSizes(theme);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <MetadataProvider>
      <CssBaseline />
      <SnackbarProvider>
        <WebRoute />
      </SnackbarProvider>
    </MetadataProvider>
  </ThemeProvider>
);
