import React from "react";
import AppHeader from "components/AppHeader/AppHeader";
import { Box, Typography } from "@mui/material";
import CustomTypo from "components/Reusables/CustomTypo";

const Error404Page = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppHeader />
      <CustomTypo variant="h1">404 Error!</CustomTypo>
      <CustomTypo variant="h4">{"Page not found :("}</CustomTypo>
    </Box>
  );
};

export default Error404Page;
