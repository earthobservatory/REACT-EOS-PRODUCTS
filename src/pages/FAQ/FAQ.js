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
  Divider,
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

const AccordionComponent = ({
  panelID,
  handleChange,
  expanded,
  summary,
  children,
}) => {
  return (
    <Accordion expanded={expanded === panelID} onChange={handleChange(panelID)}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls={`${panelID}-content`}
        id={`${panelID}-header`}
      >
        <Typography sx={{ fontWeight: 800, flexShrink: 0, fontSize: 24 }}>
          {summary}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Divider />
        <Box>{children}</Box>
      </AccordionDetails>
    </Accordion>
  );
};

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
              <AccordionComponent
                summary={`What are damage proxy maps (DPMs) and flood proxy maps
              (FPMs)?`}
                panelID={"panel1"}
                handleChange={handleChange}
                expanded={expanded}
              >
                DPMs and FPMs are maps that shows changes the earth’s surface,
                before and after an event.
                <br />
                <br />
                DPMs estimate where damage has been caused by ground-based
                events, such as earthquakes and landslides, while FPMs estimate
                the damage caused by flooding.
                <br />
                <br />
                These maps are useful because they can be produced rapidly and
                remotely, allowing disaster response teams to assess a situation
                and make decision on resource allocation.
              </AccordionComponent>

              <AccordionComponent
                summary={`How are the maps produced?`}
                panelID={"panel2"}
                handleChange={handleChange}
                expanded={expanded}
              >
                <br />
                The maps are produced using Interferometric Synthetic Aperture
                Radar (InSAR). InSAR is a satellite-based technology which can
                be used to measure changes on the Earth’s surface.
                <br />
                <br />
                By comparing satellite images acquired before and after the
                event, we estimate how much damage has been done over the area.
                <br />
                <br />
                <img src={INSAR_DIAGRAM} />
                <Typography sx={{ color: "text.secondary" }}>
                  {`Caption: InSAR can measures ground deformation by comparing the amount of time it takes for a signal to travel between a satellite and the target area. (Source: Cheryl Tay/Earth Observatory of Singapore) `}
                </Typography>
              </AccordionComponent>

              <AccordionComponent
                summary={`How accurate are the maps?`}
                panelID={"panel3"}
                handleChange={handleChange}
                expanded={expanded}
              >
                We strive to provide reliable maps. To do so, we validate our
                results by comparing them with on-the-ground information.
                However, there are limitations to the maps. <br />
                <br />
                In addition, our maps are produced by comparing satellite images
                acquired before and after the event. The changes observed could
                be a result of the specified event, e.g. building damaged by an
                earthquake, but they could also be due to other changes observed
                across the time (e.g. building torn down via a controlled
                demolition).
                <br />
                <br />
                The maps are also less reliable over urban and vegetated areas,
                due to [reasons].
                <br />
                <br />
                Thus, our maps should only be used as a guide to identify areas
                that are likely damaged.
                <br />
                <br />
                [For DPM team to furnish w more info, if any, please. Is there
                some way to quantify the accuracy? (E.g. 70% accurate; up to 1cm
                resolution, etc)]
              </AccordionComponent>

              <AccordionComponent
                summary={`I see that some events have multiple maps. What is the difference between them?`}
                panelID={"panel4"}
                handleChange={handleChange}
                expanded={expanded}
              >
                Different study areas? Different versions Different data sources
              </AccordionComponent>
            </Card>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default FAQPage;
