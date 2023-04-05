import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import TagFacesIcon from "@mui/icons-material/TagFaces";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.6),
}));

export default function Badges(props) {
  return (
    <Paper
      sx={{
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
        width: "100%",
        listStyle: "none",
        background: "transparent",
        p: 2,
        m: 0,
      }}
      component="ul"
    >
      {props.info.map((data) => {
        let icon;

        if (data.label === "React") {
          icon = <TagFacesIcon />;
        }

        return (
          <ListItem key={data.key}>
            <Chip
              icon={icon}
              label={data.label}
              variant="outlined"
              sx={{
                color: `${data.color}`,
                borderColor: `${data.color}`,
                fontSize: "1.1em",
                width: "fit-content",
              }}
            />
          </ListItem>
        );
      })}
    </Paper>
  );
}
