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
  Stack,
} from "@mui/material";

const ProductCard = ({
  Title,
  Image,
  Date,
  Description,
  LastUpdated,
  onClick,
}) => {
  // const [description, setDescription] = useState();

  // console.log(Description);

  // useEffect(() => {
  //   if (Description) {
  //     fetch(Description)
  //       .then((r) => {
  //         return r.text();
  //       })
  //       .then((d) => {
  //         setDescription(d);
  //       });
  //   }
  // }, []);

  return (
    <Grid item xs={2} sm={4} md={4}>
      <Card
        onClick={onClick}
        sx={{
          minHeight: "450px",
          minWidth: "250px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
        }}
      >
        <CardMedia
          component="img"
          image={Image ? Image : STOCK_IMG}
          alt="preview image"
          height="175px"
          loading="lazy"
        />
        <CardContent
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Stack sx={{ flexGrow: 1, gap: 1 }}>
            <Typography style={{ wordWrap: "break-word" }} variant="h5">
              {Title}
            </Typography>
            <Typography variant="body1">{Date}</Typography>
            <Typography
              sx={{
                display: "-webkit-box",
                overflow: "hidden",
                WebkitBoxOrient: "vertical",
                WebkitLineClamp: 3,
              }}
              variant="body1"
            >
              {Description}
            </Typography>
          </Stack>

          <Typography variant="body1" sx={{ marginTop: "auto" }}>
            Last updated: {LastUpdated}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProductCard;
