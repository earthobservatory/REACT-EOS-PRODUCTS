import React from "react";
import { useState, useEffect } from "react";
import { Button, Box, LinearProgress, Typography } from "@mui/material";
import BACKGROUND_IMG from "assets/EOS_PRODUCT.png";
import { getRoute } from "utils/routes";
import { useNavigate } from "react-router-dom";
import AppHeader from "components/AppHeader/AppHeader";
import EOS_RS_LOGO from "assets/EOS-RS-Logo.png";

const LandingPage = () => {
  const Navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  // if (isLoading) {
  //   return <LinearProgress />;
  // }

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05)), url(${BACKGROUND_IMG})`,
        backgroundSize: "contain",
        display: "flex",
        width: "100vw",
        height: "100vh",
      }}
    >
      <Box
        sx={{
          backdropFilter: "blur(2px)",
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <AppHeader />
        {/* <Typography variant="h4" textAlign="center" color="white">
          EOS-RS
        </Typography> */}
        <img src={EOS_RS_LOGO} height={"80px"} />
        <Typography
          variant="h1"
          textAlign="center"
          fontWeight="800"
          color="white"
        >
          PRODUCTS PAGE
        </Typography>
        <Button
          variant="outlined"
          type="primary"
          sx={{ width: "50%", borderRadius: "5rem", marginTop: "2rem" }}
          onClick={() => {
            Navigate(getRoute("home"));
          }}
        >
          View Home Page
        </Button>
      </Box>
    </Box>
  );
};

export default LandingPage;
