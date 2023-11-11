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
import INSAR_DIAGRAM from "assets/inSAR_diagram.png";
import { HEADER_HEIGHT } from "utils/constants";

const FAQPage = () => {
  const Navigate = useNavigate();

  const [expanded, setExpanded] = React.useState(false);

  const handleChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <Box>
      <AppHeader />

      <Grid container sx={{ paddingTop: HEADER_HEIGHT }}>
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
                // height: "60vh",
                background: "rgba(235, 253, 255, 0.55)",
                borderRadius: "16px",
                boxShadow: " 0 4px 30px rgba(0, 0, 0, 0.1)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(109, 240, 255, 0.29)",
                overflowY: "auto",
                padding: "1rem",
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
                  <Typography sx={{ fontWeight: 800, flexShrink: 0 }}>
                    {`What are damage proxy maps (DPMs) and flood proxy maps
                    (FPMs)?`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {`DPMs and FPMs are maps that shows changes the earth’s surface, before and after an event.  

 

DPMs estimate where damage has been caused by ground-based events, such as earthquakes and landslides, while FPMs estimate the damage caused by flooding. 

  

These maps are useful because they can be produced rapidly and remotely, allowing disaster response teams to assess a situation and make decision on resource allocation. 

  

How are the maps produced? 

The maps are produced using Interferometric Synthetic Aperture Radar (InSAR). InSAR is a satellite-based technology which can be used to measure changes on the Earth’s surface.   

 

By comparing satellite images acquired before and after the event, we estimate how much damage has been done over the area. 

 `}
                  </Typography>
                  <img src={INSAR_DIAGRAM} />
                  <Typography sx={{ color: "text.secondary" }}>
                    {`Caption: InSAR can measures ground deformation by comparing the amount of time it takes for a signal to travel between a satellite and the target area. (Source: Cheryl Tay/Earth Observatory of Singapore) `}
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
                  <Typography sx={{ flexShrink: 0 }}>
                    {`How accurate are the maps?`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {`We strive to provide reliable maps. To do so, we validate our results by comparing them with on-the-ground information. However, there are limitations to the maps. 

 

In addition, our maps are produced by comparing satellite images acquired before and after the event. The changes observed could be a result of the specified event, e.g. building damaged by an earthquake, but they could also be due to other changes observed across the time (e.g. building torn down via a controlled demolition).  

 

The maps are also less reliable over urban and vegetated areas, due to [reasons]. 

 

Thus, our maps should only be used as a guide to identify areas that are likely damaged.  

 

[For DPM team to furnish w more info, if any, please. Is there some way to quantify the accuracy? (E.g. 70% accurate; up to 1cm resolution, etc)] `}
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
                  <Typography sx={{ flexShrink: 0 }}>
                    {`I see that some events have multiple maps. What is the difference between them?`}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>
                    {`
Different study areas? 

Different versions 

Different data sources 
`}
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
