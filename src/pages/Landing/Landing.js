import React from "react";
import { useState, useEffect } from "react";
import { Button, Box, LinearProgress, Typography } from "@mui/material";
import BACKGROUND_IMG from "assets/EOS_PRODUCT.png";
import { getRoute } from "utils/routes";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  const Navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  // if (isLoading) {
  //   return <LinearProgress />;
  // }

  return (
    <Box
      sx={{
        backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url(${BACKGROUND_IMG})`,
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
        <Typography variant="h4" textAlign="center" color="white">
          EOS-RS
        </Typography>
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
