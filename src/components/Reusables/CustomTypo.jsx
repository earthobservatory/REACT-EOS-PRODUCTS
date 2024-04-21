import React from "react";
import { Typography, styled } from "@mui/material";

const CustomTypo = ({ variant: customVariant, bold, italic, sx, ...props }) => {
  const selectedVariant = customVariant || "body1";

  const style = {};

  if (bold) {
    style.fontWeight = 700;
  }
  if (italic) {
    style.fontStyle = "italic";
  }

  return (
    <Typography variant={selectedVariant} sx={{ ...style, ...sx }} {...props} />
  );
};

export default CustomTypo;
