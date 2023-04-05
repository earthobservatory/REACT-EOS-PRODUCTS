import { Typography } from "@mui/material";
import "../../utils/Gradient.css";
import * as React from "react";

// need to write function to match configuration with different variant
export default function CustomTypo(props) {
  return (
    <Typography
      color={props.color}
      variant={props.variant}
      fontWeight={500}
      sx={{ m: "1%" }}
    >
      <span className={props.gradient}>{props.children}</span>
    </Typography>
  );
}
