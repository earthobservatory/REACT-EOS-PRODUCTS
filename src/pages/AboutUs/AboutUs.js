import React from "react";
import { useState, useEffect } from "react";
import { Button, Box, LinearProgress, Typography, Grid } from "@mui/material";
import BACKGROUND_IMG from "assets/EOS_PRODUCT.png";
import SATELLITE_IMG from "assets/satellite-stock.jpeg";
import { getRoute } from "utils/routes";
import { useNavigate } from "react-router-dom";

const AboutUsPage = () => {
  const Navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  // if (isLoading) {
  //   return <LinearProgress />;
  // }

  return (
    <>
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
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          <Typography
            variant="h1"
            textAlign="center"
            fontWeight="800"
            color="white"
          >
            PRODUCTS PAGE
          </Typography>
          <Typography
            variant="h6"
            textAlign="center"
            color="white"
            sx={{ padding: 8 }}
          >
            The EOS Remote Sensing Lab (EOS-RS) is a flagship laboratory at the
            Earth Observatory of Singapore. We use satellite remote-sensing data
            for rapid disaster response and hazard monitoring.
          </Typography>

          <Button
            type="primary"
            onClick={() => {
              Navigate(getRoute("home"));
            }}
          >
            View Home Page
          </Button>
        </Box>
      </Box>

      <Grid container>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              // backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              flexDirection: "column",
              gap: "1rem",
              display: "flex",
              width: "100%",
              height: "100vh",
              justifyContent: "center",
            }}
          >
            <Typography
              variant="h2"
              textAlign="center"
              fontWeight="800"
              color="#0A0231"
            >
              PRODUCTS PAGE
            </Typography>
            <Typography
              variant="h6"
              textAlign="center"
              color="#0A0231"
              sx={{ padding: 8 }}
            >
              The EOS Remote Sensing Lab (EOS-RS) is a flagship laboratory at
              the Earth Observatory of Singapore. We use satellite
              remote-sensing data for rapid disaster response and hazard
              monitoring.
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.6)), url(${SATELLITE_IMG})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              display: "flex",
              width: "100%",
              height: "100vh",
            }}
          >
            <Box
              sx={{
                backdropFilter: "blur(2px)",
                flex: 1,
                display: "flex",
                justifyContent: "center",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <Typography
                variant="h2"
                textAlign="center"
                fontWeight="800"
                color="white"
              >
                Ready to use our products?
              </Typography>
              <Typography
                variant="h6"
                textAlign="center"
                color="white"
                sx={{ padding: 8 }}
              >
                Start now!
              </Typography>

              <Button
                type="primary"
                onClick={() => {
                  Navigate(getRoute("home"));
                }}
              >
                View Home Page
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default AboutUsPage;
