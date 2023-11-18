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
    <Grid item xs={12} sm={6} md={3} lg={3} sx={{ maxWidth: "100%" }}>
      <ScaleUpOnHover>
        <Card
          onClick={onClick}
          sx={{
            minHeight: "550px",
            minWidth: "250px",
            maxWidth: "100%",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
            background: "rgba(255, 255, 255, 1)",
            borderRadius: "16px",
            boxShadow: " 0 4px 30px rgba(0, 0, 0, 0.1)",

            border: "1px solid rgba(180, 240, 255, 0.29)",
          }}
        >
          {loading ? (
            <Skeleton
              sx={{ backgroundColor: "rgb(89 95 101 / 50%)" }}
              height={200}
              variant="rounded"
            />
          ) : (
            <></>
          )}

          <img
            // component="img"
            src={Image ? Image : STOCK_IMG}
            style={{
              objectFit: "cover",
              objectPosition: "-20px 50%",
              // backgroundImage: `url(${Image ? Image : STOCK_IMG})`,
              // backgroundSize: "350px",
            }}
            width={"700px"}
            alt="preview image"
            height={loading ? "0px" : "200px"}
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
