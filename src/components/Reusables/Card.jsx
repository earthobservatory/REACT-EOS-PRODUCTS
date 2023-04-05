import * as React from "react";
import { Card, CardContent, CardMedia } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import img1 from "../../utils/Images/study.jpg";

const CustomCard = styled(Card)(({ theme, bg }) => ({
  background: `linear-gradient(to top, rgba(255,0,0,0),${alpha(
    bg === undefined ? theme.palette.primary.main : bg,
    1
  )})`,
  margin: "1%",
  height: "50vh",
  borderRadius: 20,
  paddingBottom: "3%",
  boxShadow: `0 3px 5px 2px ${alpha(
    bg === undefined ? theme.palette.primary.main : bg,
    0.2
  )}`,
}));

//to be changed coz the photo source is only one ...
export default function ProductCard(props) {
  return (
    <CustomCard bg={props.bg} sx={props.sx}>
      <CardMedia
        component="img"
        height={"60%"}
        image={img1}
        alt="Paella dish"
      />
      <CardContent>{props.children}</CardContent>
    </CustomCard>
  );
}
