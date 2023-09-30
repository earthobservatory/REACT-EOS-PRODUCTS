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

const AppHeader = () => {
  const Navigate = useNavigate();
  function EOSIcon(props) {
    return (
      <img
        resizeMode="contain"
        src={logo}
        alt="logo"
        style={{ width: "165px", height: "64px" }}
      />
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
      }}
    >
      <AppBar
        position="static"
        sx={{
          height: HEADER_HEIGHT,
          backdropFilter: "blur(16px)",
          "&:after": {
            content: "''",
            background: `url(${Noise})`,
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            zIndex: -1,
            opacity: 0.3 /* Here is your opacity */,
          },
        }}
      >
        <Toolbar>
          <Button
            onClick={() => {
              Navigate(getRoute("landing"));
            }}
          >
            <EOSIcon size={54} />
          </Button>
          <Typography
            variant="h5"
            color="white"
            sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 3, ml: "1%" }}
          >
            EOS-RS
          </Typography>
          <Button
            onClick={() => {
              Navigate(getRoute("home"));
            }}
          >
            <Typography color="white" sx={{ fontWeight: 500 }}>
              Home
            </Typography>
          </Button>
          <Button
            onClick={() => {
              Navigate(getRoute("aboutus"));
            }}
          >
            <Typography color="white" sx={{ fontWeight: 500 }}>
              About Us
            </Typography>
          </Button>
          <Button>
            <Typography color="white" sx={{ fontWeight: 500 }}>
              How to use
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppHeader;
