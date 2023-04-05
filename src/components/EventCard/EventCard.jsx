import React from "react";
import { API, HEADER_HEIGHT } from "../../utils/constants";
import { useState, useEffect } from "react";
import STOCK_IMG from "assets/EOS_PRODUCT.png";

import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Grid,
} from "@mui/material";

const EventCard = ({ Title, Description, LastUpdated, onClick }) => {
  return (
    <Grid item xs={2} sm={4} md={4}>
      <Card
        onClick={onClick}
        sx={{
          minHeight: "350px",
          minWidth: "250px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardMedia
          component="img"
          image={STOCK_IMG}
          alt="preview image"
          height="175px"
        />
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="h5">{Title}</Typography>
            <Typography variant="body1">{Description}</Typography>
          </Box>

          <Typography variant="body1" sx={{ marginTop: "auto" }}>
            Last updated: {LastUpdated}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default EventCard;
