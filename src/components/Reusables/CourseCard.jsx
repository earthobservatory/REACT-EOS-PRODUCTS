import * as React from "react";
import { Card, CardContent } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const ModCard = styled(Card)(({ theme, bg, ht, wt }) => ({
  background: `linear-gradient(to top, rgba(255, 255, 255, 0),${alpha(
    bg === undefined ? theme.palette.primary.main : bg,
    1
  )})`,
  margin: "1%",
  minHeight: ht === undefined ? "fit-content" : ht,
  backdropFilter: "blur(20px)",
  borderRadius: 15,
  overflowWrap: "anywhere",
  maxWidth: "fit-content",
  boxShadow: `0 3px 5px 2px ${alpha(
    bg === undefined ? theme.palette.primary.main : bg,
    0.2
  )}`,
}));

export default function CourseCard(props) {
  return (
    <ModCard bg={props.bg} sx={props.sx} ht={props.ht} wt={props.ht}>
      <CardContent>{props.children}</CardContent>
    </ModCard>
  );
}
