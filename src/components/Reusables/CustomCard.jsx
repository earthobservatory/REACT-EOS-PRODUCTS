import * as React from "react";
import { Box, Card, CardContent } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const ModCard = styled(Card)(({ theme, bg, ht, wt }) => ({
  // background: `linear-gradient(to top, rgba(255, 255, 255, 0),${alpha(
  //   bg === undefined ? theme.palette.primary.main : bg,
  //   1
  // )})`,
  margin: "1%",
  minHeight: ht === undefined ? "fit-content" : ht,
  // backdropFilter: "blur(20px)",
  borderRadius: 15,
  overflowWrap: "anywhere",
  maxWidth: "fit-content",
  boxShadow: `0 3px 5px 2px ${alpha(
    bg === undefined ? theme.palette.primary.main : bg,
    0.2
  )}`,
}));

export function CustomPopup({ sx, children, open = true }) {
  return (
    <Box
      sx={{
        position: "absolute",
        backgroundColor: "#32323288",
        transform: "translate(-50%, -50%)",

        borderRadius: "5px",
        left: "50%",
        top: "50%",
        zIndex: 10000,
        // padding: "1rem",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
        visibility: open ? "none" : "hidden",
      }}
      {...sx}
    >
      {children}
    </Box>
  );
}

export default function CustomCard({ sx, children }) {
  return (
    <Box
      sx={{
        backgroundColor: "#32323288",
        borderRadius: "5px",
        // padding: "1rem",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
      }}
      {...sx}
    >
      {children}
    </Box>
  );
}

export function OutlineCard({ sx, children }) {
  return (
    <Box
      sx={{
        backgroundColor: "#32323288",
        borderRadius: "5px",
        outlineWidth: "4px",
        // padding: "1rem",
        backdropFilter: "blur(8px)",
        display: "flex",
        flexDirection: "column",
        padding: "1rem",
      }}
      {...sx}
    >
      {children}
    </Box>
  );
}
