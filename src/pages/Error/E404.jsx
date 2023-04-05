import React from "react";
import AppHeader from "components/AppHeader/AppHeader";
import { Box, Typography } from "@mui/material";

const Error404Page = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppHeader />
      <Typography variant="h1">404 Error!</Typography>
      <Typography variant="h4">{"Page not found :("}</Typography>
    </Box>
  );
};

export default Error404Page;
