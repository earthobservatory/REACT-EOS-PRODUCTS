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
import BACKGROUND_IMG from "assets/Sent1-ESA-ModifiedEOSRS.png";
import { getRoute } from "utils/routes";
import { useNavigate } from "react-router-dom";
import REMOTE_LOGO from "assets/EOS-RS-Logo.png";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AppHeader from "components/AppHeader/AppHeader";
import INSAR_DIAGRAM from "assets/inSAR_diagram.png";
import { HEADER_HEIGHT } from "utils/constants";
import MAP_SELECTION_GIF from "assets/Map-version-selection.gif";
import CustomTypo from "components/Reusables/CustomTypo";
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
        <CustomTypo
          sx={{
            fontWeight: 800,
            flexShrink: 0,
            fontSize: { md: 24, xs: 18 },
            wordWrap: "break-word",
            width: "100%",
          }}
        >
          {summary}
        </CustomTypo>
      </AccordionSummary>
      <AccordionDetails>
        <Divider />
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            padding: "1rem",
          }}
        >
          {children}
        </Box>
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

      <Box
        sx={{
          // backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2))`,
          flexDirection: "column",
          gap: "1rem",
          display: "flex",
          width: "100%",
          justifyContent: "center",
          alignItems: "center",
          marginTop: HEADER_HEIGHT + "",
          paddingBottom: "1rem",
        }}
      >
        <CustomTypo variant={"h1"} fontWeight={800}>
          FAQ
        </CustomTypo>
        <Card
          sx={{
            width: "60vw",
            minHeight: "40vh",
            transition: "transform 0.3s ease-in-out",
            // height: "60vh",

            background: "#32323288",

            borderRadius: "16px",
            boxShadow: " 0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(16px)",
            // border: "1px solid rgba(109, 240, 255, 0.29)",

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
            DPMs estimate where changes to the ground have likely occurred,
            potentially a result of earthquakes and landslides, while FPMs
            estimates the areas that are likely flooded.
            <br />
            <br />
            These maps are useful because they can be produced rapidly and
            remotely, allowing disaster response teams to assess a situation and
            make decisions on resource allocation.
          </AccordionComponent>

          <AccordionComponent
            summary={`How are the maps produced?`}
            panelID={"panel2"}
            handleChange={handleChange}
            expanded={expanded}
          >
            The maps are produced using Interferometric Synthetic Aperture Radar
            (InSAR). InSAR is a satellite-based technology which can be used to
            measure changes on the Earth’s surface.
            <br />
            <br />
            By comparing satellite images acquired before and after the event,
            we estimate how much change has occurred over a given area.
            <br />
            <br />
            <img src={INSAR_DIAGRAM} style={{ maxWidth: "80%" }} />
            <CustomTypo sx={{ color: "text.secondary" }}>
              {`Caption: InSAR can measures ground deformation by comparing the amount of time it takes for a signal to travel between a satellite and the target area. (Source: Cheryl Tay/Earth Observatory of Singapore). The satellite data we use are from Japan Aerospace Exploration Agency’s ALOS-2 and European Space Agency’s Sentinel-1. The satellite data have a ground resolution of 25m and 30m per pixel, respectively.`}
            </CustomTypo>
          </AccordionComponent>

          <AccordionComponent
            summary={`Why InSAR?`}
            panelID={"panel3"}
            handleChange={handleChange}
            expanded={expanded}
          >
            InSAR maps the deformation of ground using radar images of the
            Earth's surface that are collected from orbiting satellites.
            <br />
            Unlike optical imagery, INSAR is not subject to weather and light
            conditions. Radar waves used by INSAR can penetrate clouds and are
            equally effective in darkness, providing round-the-clock monitoring.
          </AccordionComponent>

          <AccordionComponent
            summary={`How accurate are the maps?`}
            panelID={"panel4"}
            handleChange={handleChange}
            expanded={expanded}
          >
            We strive to provide reliable maps. To do so, we validate our
            results by comparing them with on-the-ground information. However,
            there are limitations to the maps. <br />
            <br />
            We validate our maps by comparing them with on-the-ground
            information, such as media reports and optical imagery. However,
            there are limitations to the maps.
            <br />
            <br />
            Our maps are produced by comparing satellite images acquired before
            and after the event. The changes observed could be a result of the
            specified event, e.g. building damaged by an earthquake, but they
            could also be due to other changes observed across the time (e.g. a
            new building).
            <br />
            <br />
            DPMs may be less reliable over vegetated areas, and FPMs may be less
            reliable over urban and vegetated areas, due to signal interference.
            <br />
            <br />
            Thus, our maps should only be used as a guide to identify areas that
            are likely damaged or flooded.
          </AccordionComponent>

          <AccordionComponent
            summary={`I see that some events have multiple maps. What is the difference between them?`}
            panelID={"panel5"}
            handleChange={handleChange}
            expanded={expanded}
          >
            Some events may have multiple layers of maps. You may view any
            number of them by checking the boxes. There could be variations
            across:
            <br />
            <br />
            1. Study area
            <br />
            2. Version (the higher the version number, the more robust the map
            is, e.g. v1.2 is more accurate than v0.5)
            <br />
            3. Source of satellite data (e.g. ALOS-2 or Sentinel-1)
            <br />
            <br />
            To learn more about each layer, click on the purple area for a
            caption.
            <img src={MAP_SELECTION_GIF} style={{ maxWidth: "80%" }} />
          </AccordionComponent>
        </Card>

        <br />
        <br />

        <CustomTypo variant={"h1"} fontWeight={800}>
          Legal Disclaimer
        </CustomTypo>
        <CustomTypo
          variant={"h6"}
          fontWeight={200}
          marginLeft={20}
          marginRight={20}
          textAlign={"justify"}
        >
          While EOS-RS has made reasonable efforts to ensure the accuracy of the
          information presented, EOS-RS makes no representations or warranties
          of any kind, express or implied, about the completeness, accuracy,
          reliability, suitability, or availability with respect to the map or
          the information, products, services, or related graphics contained on
          the map for any purpose. Any reliance you place on such information is
          therefore strictly at your own risk. In no event will EOS-RS be liable
          for any profits, loss of goodwill, loss of use, loss of production or
          business interruption costs, or any type of indirect, special,
          consequential, or incidental damages arising in connection with the
          use of this map. Please use this map responsibly and consult official
          sources for any decision-making. If you have any questions or concerns
          about the map or its content, please contact us at eos-rs@ntu.edu.sg
        </CustomTypo>
        <br />
      </Box>
    </Box>
  );
};

export default FAQPage;
