import React from "react";
import { useState, useEffect } from "react";
import { Button, Box, LinearProgress, Typography, Grid } from "@mui/material";
import BACKGROUND_IMG from "assets/EOS_PRODUCT.png";
import SATELLITE_IMG from "assets/Sent1-ESA-ModifiedEOSRS.png";
import { getRoute } from "utils/routes";
import { useNavigate } from "react-router-dom";
import REMOTE_LOGO from "assets/EOS-RS-Logo.png";
import AppHeader from "components/AppHeader/AppHeader";

const AboutUsPage = () => {
  const Navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  // if (isLoading) {
  //   return <LinearProgress />;
  // }

  return (
    <>
      <AppHeader />
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
            alignItems: "center",
            gap: "1rem",
          }}
        >
          {/* <Typography
            variant="h1"
            textAlign="center"
            fontWeight="800"
            color="white"
          >
            REMOTE SENSING
          </Typography> */}
          <img src={REMOTE_LOGO} style={{ maxWidth: "80vw" }} />
          <Typography
            variant="h5"
            textAlign="center"
            color="white"
            fontWeight={800}
            sx={{ padding: 8 }}
          >
            The EOS Remote Sensing Lab (EOS-RS) is a flagship laboratory at the
            Earth Observatory of Singapore. We use satellite remote-sensing data
            for rapid disaster response and hazard monitoring.
          </Typography>
          <Button
            type="primary"
            variant="outlined"
            sx={{ width: "50%", borderRadius: "5rem", marginTop: "2rem" }}
            // onClick={() => {
            //   Navigate(getRoute("home"));
            // }}
            href="https://earthobservatory.sg/research/centres-labs/eos-rs"
          >
            Click to read more about EOS-RS
          </Button>
        </Box>
      </Box>

      <Grid container>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              // backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))`,
              backgroundColor: "#EFEFEF",
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
              We support stakeholders and decision makers by monitoring and
              mapping hazards and disasters, environmental crises, sea-level
              rise and climate change using cutting-edge technology in remote
              sensing (e.g. SAR, LiDAR, optical). <br />
              <br />
              We will drive scientific innovation and improved understanding of
              hazards through development of new algorithms and systems and
              through symbiotic collaboration with global partners.
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
                variant="outlined"
                sx={{
                  // width: "50%",
                  marginX: "2rem",
                  borderRadius: "5rem",
                  marginTop: "2rem",
                  // justifySelf: "center",
                }}
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
