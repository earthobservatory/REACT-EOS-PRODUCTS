import React from "react";
import { API, HEADER_HEIGHT } from "../../utils/constants";
import { useState, useEffect } from "react";
import STOCK_IMG from "assets/EOS_PRODUCT.png";
import Noise from "assets/noise.svg";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Grid,
  Stack,
  Chip,
} from "@mui/material";
import ScaleUpOnHover from "utils/Animations/ScaleUpOnHover";

const EventCard = ({
  Title,
  Image,
  Date,
  Description,
  Tags,
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
      <ScaleUpOnHover>
        <Card
          onClick={onClick}
          sx={{
            minHeight: "450px",
            minWidth: "250px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            background: "rgba(255, 255, 255, 0.85)",
            borderRadius: "16px",
            boxShadow: " 0 4px 30px rgba(0, 0, 0, 0.1)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(180, 240, 255, 0.29)",
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
          }}
        >
          <CardMedia
            component="img"
            image={Image ? Image : STOCK_IMG}
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
                {decodeURIComponent(escape(Description))}
              </Typography>
            </Stack>
            <Stack direction={"row"}>
              {Tags.map((item) => (
                <Chip key={item} label={item} />
              ))}
            </Stack>
            <Typography variant="body1" sx={{ marginTop: "auto" }}>
              Last updated: {LastUpdated}
            </Typography>
          </CardContent>
        </Card>
      </ScaleUpOnHover>
    </Grid>
  );
};

export default EventCard;
