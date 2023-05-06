import * as React from "react";
import { AppBar } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";
import Noise from "assets/noise.svg";

const CustomNavBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(to right, rgba(0,0,0,0.3),${alpha(
    theme.palette.primary.main,
    0.5
  )})`,
  backdropFilter: "blur(15px)",
  marginTop: "0.5%",
  borderRadius: 15,
  boxShadow: `0 3px 5px 2px ${alpha(theme.palette.primary.main, 0.3)}`,
  backdropFilter: "blur(16px)",
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
}));

export default function NavBar(props) {
  return <CustomNavBar>{props.children}</CustomNavBar>;
}
