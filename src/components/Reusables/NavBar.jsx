import * as React from "react";
import { AppBar } from "@mui/material";
import { alpha, styled } from "@mui/material/styles";

const CustomNavBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(to right, rgba(0,0,0,0.3),${alpha(
    theme.palette.primary.main,
    0.5
  )})`,
  backdropFilter: "blur(15px)",
  marginTop: "0.5%",
  borderRadius: 15,
  boxShadow: `0 3px 5px 2px ${alpha(theme.palette.primary.main, 0.3)}`,
}));

export default function NavBar(props) {
  return <CustomNavBar>{props.children}</CustomNavBar>;
}
