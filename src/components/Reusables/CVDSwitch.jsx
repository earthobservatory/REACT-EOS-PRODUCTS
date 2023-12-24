import * as React from "react";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const CVDSwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        borderRadius: 50 / 2,
        backgroundColor: "#003892",
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 23 23"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M12 4C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: "#ffbd59",

    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M20.95 14.88a6.985 6.985 0 0 1-6.07 6.07c-.51.06-.88.49-.88.99 0 .04 0 .08.01.12.07.55.57.94 1.12.87 4.09-.51 7.3-3.72 7.81-7.81.06-.55-.33-1.05-.88-1.11-.55-.07-1.05.32-1.11.87zm-2.11.38c.14-.53-.18-1.08-.72-1.22-.54-.14-1.08.18-1.22.72-.27 1.05-1.09 1.87-2.15 2.15-.45.12-.75.52-.75.97 0 .08.01.17.03.25.14.53.69.85 1.22.72 1.77-.47 3.14-1.84 3.59-3.59zM21.8 4.12 18.26.58c-.78-.78-2.05-.78-2.83 0l-3.18 3.18c-.78.78-.78 2.05 0 2.83l1.24 1.24-.71.71-1.23-1.24c-.78-.78-2.05-.78-2.83 0L7.3 8.72c-.78.78-.78 2.05 0 2.83l1.24 1.24-.71.71-1.23-1.25c-.78-.78-2.05-.78-2.83 0L.59 15.43c-.78.78-.78 2.05 0 2.83l3.54 3.54c.78.78 2.05.78 2.83 0l3.18-3.18c.78-.78.78-2.05 0-2.83L8.9 14.55l.71-.71 1.24 1.24c.78.78 2.05.78 2.83 0l1.41-1.41c.78-.78.78-2.05 0-2.83L13.84 9.6l.71-.71 1.24 1.24c.78.78 2.05.78 2.83 0l3.18-3.18c.78-.78.78-2.05 0-2.83zM5.54 20.38 2 16.85l1.06-1.06 3.54 3.54-1.06 1.05zm2.12-2.12-3.54-3.54 1.06-1.06 3.54 3.54-1.06 1.06zm9.54-9.54-3.54-3.54 1.06-1.06 3.54 3.54-1.06 1.06zm2.12-2.12-3.54-3.54L16.85 2l3.54 3.54-1.07 1.06z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

export default CVDSwitch;
