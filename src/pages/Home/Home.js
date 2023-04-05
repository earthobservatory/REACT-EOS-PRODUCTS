import React from "react";
import { API, HEADER_HEIGHT } from "../../utils/constants";
import { useState, useEffect } from "react";
import AppHeader from "../../components/AppHeader/AppHeader";
import {
  Button,
  Box,
  LinearProgress,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EventCard from "components/EventCard/EventCard";
import { Search, FilterList } from "@mui/icons-material";
import { getRoute } from "utils/routes";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const Navigate = useNavigate();
  // const [loading, setLoading] = useState(false);

  // if (isLoading) {
  //   return <LinearProgress />;
  // }

  return (
    <Box>
      <AppHeader />
      <Box
        sx={{
          display: "flex",
          flexDirection: " column",
          flexGrow: 1,
          padding: "2rem",
          gap: "3rem",
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight="800">
            Recent events
          </Typography>
          <Typography variant="h6">Click to view maps</Typography>
          <Grid
            sx={{ padding: "1rem" }}
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 2, sm: 8, md: 12 }}
          >
            <EventCard
              Title="Afghanistan"
              Description="Afghanistan, 22 Mar 2023"
              LastUpdated="24 Mar 2023"
              onClick={() => {
                Navigate(getRoute("leaflet"));
              }}
            />
            <EventCard
              Title="Afghanistan"
              Description="Afghanistan, 22 Mar 2023"
              LastUpdated="24 Mar 2023"
            />
            <EventCard
              Title="Afghanistan"
              Description="Afghanistan, 22 Mar 2023"
              LastUpdated="24 Mar 2023"
            />
            <EventCard
              Title="Afghanistan"
              Description="Afghanistan, 22 Mar 2023"
              LastUpdated="24 Mar 2023"
            />
          </Grid>
        </Box>

        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h3" fontWeight="800">
                All events
              </Typography>
              <Typography variant="h6">Click to view</Typography>
            </Box>

            <TextField
              label="Search"
              variant="outlined"
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton>
                      <Search />
                    </IconButton>
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <FilterList />
                    </IconButton>
                  </InputAdornment>
                ),
                style: { borderRadius: "20px" },
              }}
            />
          </Box>
          <Grid
            sx={{ padding: "1rem" }}
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 2, sm: 8, md: 12 }}
          >
            <EventCard
              Title="Afghanistan"
              Description="Afghanistan, 22 Mar 2023"
              LastUpdated="24 Mar 2023"
            />
            <EventCard
              Title="Afghanistan"
              Description="Afghanistan, 22 Mar 2023"
              LastUpdated="24 Mar 2023"
            />
            <EventCard
              Title="Afghanistan"
              Description="Afghanistan, 22 Mar 2023"
              LastUpdated="24 Mar 2023"
            />
            <EventCard
              Title="Afghanistan"
              Description="Afghanistan, 22 Mar 2023"
              LastUpdated="24 Mar 2023"
            />
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
