import { Button, Stack, Toolbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { getRoute } from "../../utils/routes";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import EOS_LOGO from "assets/EOS Logo.png";

const fontWeight = 800;

const CustomToolbar = ({ isMapPage, handleDrawerOpen, open }) => {
  const Navigate = useNavigate();

  function EOSIcon(props) {
    return (
      <img
        src={EOS_LOGO}
        alt="logo"
        style={{ width: "165px", height: "64px" }}
      />
    );
  }

  return (
    <Toolbar>
      {isMapPage ? (
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={handleDrawerOpen}
          edge="start"
          sx={{ mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
      ) : (
        <></>
      )}

      <Button
        onClick={() => {
          Navigate(getRoute("home"));
        }}
      >
        <EOSIcon size={54} />
      </Button>
      {/* <Typography
        variant="h5"
        color="white"
        sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 3, ml: "1%" }}
      >
        EOS-RS
      </Typography> */}
      <Stack
        sx={{ width: "100%", justifyContent: "end", height: "100%" }}
        gap={3}
        direction={"row"}
      >
        <Button
          onClick={() => {
            Navigate(getRoute("home"));
          }}
        >
          <Typography color="white" fontWeight={fontWeight}>
            Home
          </Typography>
        </Button>
        <Button
          onClick={() => {
            Navigate(getRoute("aboutus"));
          }}
        >
          <Typography color="white" fontWeight={fontWeight}>
            About Us
          </Typography>
        </Button>
        {/* <Button>
          <Typography color="white" sx={{ fontWeight: 500 }}>
            How to use
          </Typography>
        </Button> */}
        <Button
          onClick={() => {
            Navigate(getRoute("faq"));
          }}
        >
          <Typography color="white" fontWeight={fontWeight}>
            FAQ
          </Typography>
        </Button>
      </Stack>
    </Toolbar>
  );
};

export default CustomToolbar;
