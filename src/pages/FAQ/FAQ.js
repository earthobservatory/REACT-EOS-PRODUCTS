import React from "react";
import { useState, useEffect } from "react";
import {
  Button,
  Box,
  LinearProgress,
  Typography,
  Grid,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Card,
} from "@mui/material";
import BACKGROUND_IMG from "assets/EOS_PRODUCT.png";
import SATELLITE_IMG from "assets/satellite-stock.jpeg";
import { getRoute } from "utils/routes";
import { useNavigate } from "react-router-dom";
import REMOTE_LOGO from "assets/EOS-RS-Logo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AppHeader from "components/AppHeader/AppHeader";
import Noise from "assets/noise.svg";

const FAQPage = () => {
  const Navigate = useNavigate();

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      <AppHeader />

      <Grid container>
        <Grid item xs={12} md={12}>
          <Box
            sx={{
              // backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))`,
              flexDirection: "column",
              gap: "1rem",
              display: "flex",
              width: "100%",
              height: "100vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h1" fontWeight={800}>
              FAQ
            </Typography>
            <Card
              sx={{
                width: "90vw",
                transition: "transform 0.3s ease-in-out",
                height: "60vh",
                background: "rgba(235, 253, 255, 0.55)",
                borderRadius: "16px",
                boxShadow: " 0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(109, 240, 255, 0.29)",
                overflowY: "auto",
                padding: "1rem",
                "&:after": {
                  content: "''",
                  background: `url(${Noise})`,
                  position: "absolute",
                  top: "0px",
                  left: "0px",
                  width: "100%",
                  height: "100%",
                  zIndex: -1,
                  opacity: 0.2 /* Here is your opacity */,
                },
              }}
            >
              <Accordion
                expanded={expanded === "panel1"}
                onChange={handleChange("panel1")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1bh-content"
                  id="panel1bh-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    General settings
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    I am an accordion
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Nulla facilisi. Phasellus sollicitudin nulla et quam mattis
                    feugiat. Aliquam eget maximus est, id dignissim quam.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel2"}
                onChange={handleChange("panel2")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel2bh-content"
                  id="panel2bh-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    Users
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    You are currently not an owner
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Donec placerat, lectus sed mattis semper, neque lectus
                    feugiat lectus, varius pulvinar diam eros in elit.
                    Pellentesque convallis laoreet laoreet.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel3"}
                onChange={handleChange("panel3")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel3bh-content"
                  id="panel3bh-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    Advanced settings
                  </Typography>
                  <Typography sx={{ color: "text.secondary" }}>
                    Filtering has been entirely disabled for whole web server
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Nunc vitae orci ultricies, auctor nunc in, volutpat nisl.
                    Integer sit amet egestas eros, vitae egestas augue. Duis vel
                    est augue.
                  </Typography>
                </AccordionDetails>
              </Accordion>
              <Accordion
                expanded={expanded === "panel4"}
                onChange={handleChange("panel4")}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel4bh-content"
                  id="panel4bh-header"
                >
                  <Typography sx={{ width: "33%", flexShrink: 0 }}>
                    Personal data
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    Nunc vitae orci ultricies, auctor nunc in, volutpat nisl.
                    Integer sit amet egestas eros, vitae egestas augue. Duis vel
                    est augue.
                  </Typography>
                </AccordionDetails>
              </Accordion>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FAQPage;
