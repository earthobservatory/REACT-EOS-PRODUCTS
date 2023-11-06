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
  Skeleton,
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
  const [loading, setLoading] = useState(true);

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
            minHeight: "500px",
            minWidth: "250px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            background: "rgba(255, 255, 255, 1)",
            borderRadius: "16px",
            boxShadow: " 0 4px 30px rgba(0, 0, 0, 0.1)",
            // backdropFilter: "blur(16px)",
            border: "1px solid rgba(180, 240, 255, 0.29)",
            // "&:after": {
            //   content: "''",
            //   background: `url(${Noise})`,
            //   position: "absolute",
            //   top: "0px",
            //   left: "0px",
            //   width: "100%",
            //   height: "100%",
            //   zIndex: -1,
            //   opacity: 0.2 /* Here is your opacity */,
            // },
          }}
        >
          {loading ? <Skeleton height={175} variant="rounded" /> : <></>}
          <CardMedia
            component="img"
            image={Image ? Image : STOCK_IMG}
            alt="preview image"
            height={loading ? "0px" : "175px"}
            loading="lazy"
            onLoad={() => {
              setLoading(false);
            }}
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
              <Typography
                style={{ wordWrap: "break-word" }}
                variant="h5"
                color={"black"}
              >
                {Title}
              </Typography>
              <Typography variant="body1" color={"black"}>
                {Date}
              </Typography>
              <Typography
                sx={{
                  display: "-webkit-box",
                  overflow: "hidden",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3,
                }}
                variant="body1"
                color={"black"}
              >
                {decodeURIComponent(escape(Description))}
              </Typography>
            </Stack>
            <Stack direction={"row"}>
              {Tags.map((item) => (
                <Chip key={item} label={item} color={"primary"} />
              ))}
            </Stack>
            <Typography
              variant="body1"
              sx={{ marginTop: "auto" }}
              color={"black"}
            >
              Last updated: {LastUpdated}
            </Typography>
          </CardContent>
        </Card>
      </ScaleUpOnHover>
    </Grid>
  );
};

export default EventCard;
