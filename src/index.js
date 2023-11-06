//Entry point for the webpack and deals with the routes
import React from "react";
import ReactDOM from "react-dom/client";
import WebRoute from "./utils/router";
import { ThemeProvider, responsiveFontSizes, CssBaseline } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import "index.css";
import { useMetadataContext } from "context/MetadataContext";
import MetadataProvider from "provider/MetadataProvider";
//context: https://github.com/vasturiano/react-force-graph/issues/409

let theme = createTheme({
  typography: {
    fontFamily: "Helvetica Neue, Roboto",
  },
  palette: {
    mode: "dark",
    background: {
      default: "rgb(39,36,37)",
    },
    primary: {
      main: "#ffbd59",
    },
    secondary: {
      main: "#ffffff",
    },
    // secondary: {
    //   main: "rgb(255, 105, 127)",
    // },
    // normal: {
    //   main: "#2596be",
    // },
  },
  components: {
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
      <WebRoute />
    </MetadataProvider>
  </ThemeProvider>
);
