import * as React from "react";
import Box from "@mui/material/Box";
import Masonry from "@mui/lab/Masonry";

export default function Gallery(props) {
  return (
    <React.Fragment>
      <Box
        sx={{
          alignItems: "center",
          justifyContent: "center",
          maxWidth: "90%",
        }}
      >
        <Masonry spacing={2} columns={{ xs: 3, sm: 3, md: 5 }} sx={{ m: "0%" }}>
          {props.children}
        </Masonry>
      </Box>
    </React.Fragment>
  );
}
