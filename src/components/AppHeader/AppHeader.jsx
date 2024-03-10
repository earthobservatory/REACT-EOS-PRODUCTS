//Top Bar that deals with user login
import React from "react";
import { useNavigate } from "react-router-dom";
import { removeToken } from "utils/helper";
import { getRoute } from "../../utils/routes";
import NavBar from "../Reusables/NavBar";
import { Box, Button, Toolbar, Typography, AppBar } from "@mui/material";
import { HEADER_HEIGHT } from "utils/constants";
import logo from "assets/EOS Logo.png";
import Noise from "assets/noise.svg";
import { useTheme } from "@mui/material/styles";
import CustomToolbar from "./Toolbar";

const AppHeader = ({ isScrolled = false }) => {
  const Navigate = useNavigate();
  const theme = useTheme();
  function EOSIcon(props) {
    return (
      <img
        // resizeMode="contain"
        src={logo}
        alt="logo"
        style={{ width: "165px", height: "64px" }}
      />
    );
  }

  return (
    // <Box
    //   sx={{
    //     flexGrow: 1,
    //     top: 0,
    //     left: 0,
    //     bottom: 0,
    //     right: 0,
    //   }}
    // >
    <AppBar
      position="fixed"
      sx={{
        height: HEADER_HEIGHT,
        zIndex: 100,
        backgroundColor: isScrolled ? "black" : "transparent",
        backgroundImage: isScrolled ? "" : "none",
        // backgroundColor: `#424242AA`,
        // backdropFilter: "blur(8px)",
      }}
    >
      <CustomToolbar />
    </AppBar>
    // </Box>
  );
};

export default AppHeader;
