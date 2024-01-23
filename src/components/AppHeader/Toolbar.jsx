import { Button, Divider, Drawer, Stack, Toolbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { getRoute } from "../../utils/routes";
import MenuIcon from "@mui/icons-material/Menu";
import { useLocation, useNavigate } from "react-router-dom";
import EOS_LOGO from "assets/EOS Logo.png";
import { useState } from "react";
import useScreenSize from "hooks/useScreenSize";
import DynamicIconMUI from "components/Reusables/DynamicIconMUI";

const fontWeight = 800;
const fontFamily = "Myriad Pro Bold";

const CustomToolbar = ({ isMapPage, handleDrawerOpen, open }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const Navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { isDesktopView } = useScreenSize();

  function EOSIcon(props) {
    return (
      <img
        src={EOS_LOGO}
        alt="logo"
        style={{ width: "165px", height: "64px" }}
      />
    );
  }

  const handleMenuOpen = () => {
    setOpenDrawer(true);
  };

  const handleMenuClose = () => {
    setOpenDrawer(false);
  };

  const MenuButtons = ({ currentPath, variant }) => {
    return (
      <>
        <Button
          onClick={() => {
            Navigate(getRoute("home"));
          }}
          sx={{
            // backgroundColor: currentPath === "/" ? "#ffbd59FF" : "transparent",
            color: currentPath === "/" ? "#ffbd59FF" : "white",
            "&:hover": {
              backgroundColor: "transparent",
              color: "#ffbd59FF",
            },
            paddingX: "2rem",
          }}
        >
          <Typography fontWeight={fontWeight} fontFamily={fontFamily}>
            Home
          </Typography>
        </Button>

        {variant == "mobile" ? <Divider /> : <></>}
        <Button
          // onClick={() => {
          //   Navigate(getRoute("aboutus"));
          // }}
          href="https://earthobservatory.sg/research/centres-labs/eos-rs"
          target="_blank"
          sx={{
            paddingX: "2rem",
            color: currentPath === "/aboutus" ? "#ffbd59FF" : "white",
            "&:hover": {
              backgroundColor: "transparent",
              color: "#ffbd59FF",
            },
          }}
          variant={variant}
        >
          <Typography fontWeight={fontWeight} fontFamily={fontFamily}>
            About Us
          </Typography>
        </Button>

        {variant == "mobile" ? <Divider /> : <></>}

        <Button
          onClick={() => {
            Navigate(getRoute("faq"));
          }}
          sx={{
            color: currentPath === "/faq" ? "#ffbd59FF" : "white",
            "&:hover": {
              backgroundColor: "transparent",
              color: "#ffbd59FF",
            },
            paddingX: "2rem",
            // Add other styles for highlighting
          }}
          variant={variant}
        >
          <Typography fontWeight={fontWeight} fontFamily={fontFamily}>
            FAQ
          </Typography>
        </Button>
      </>
    );
  };

  return (
    <>
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
          sx={{
            width: "100%",
            justifyContent: "end",
            height: "100%",
            alignItems: "center",
          }}
          direction={"row"}
        >
          {isDesktopView ? (
            <MenuButtons currentPath={currentPath} />
          ) : (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleMenuOpen}
              // edge="start"
              sx={{ height: "fit-content" }}
            >
              <MenuIcon />
            </IconButton>
          )}
        </Stack>
      </Toolbar>
      <Drawer anchor="right" open={openDrawer} onClose={handleMenuClose}>
        <Stack
          direction="row"
          // justifyContent="space-between"
          sx={{
            padding: "1rem",
            borderBottom: "1px solid #ccc",
            backgroundColor: "#333",
            color: "white",
            alignItems: "center",

            width: "40vw",
          }}
        >
          <IconButton color="inherit" onClick={handleMenuClose}>
            <DynamicIconMUI iconName={"Close"} />
          </IconButton>
          <Typography sx={{ fontWeight: 800 }} variant="h5">
            Menu
          </Typography>
        </Stack>
        <Stack sx={{ padding: 1 }}>
          <MenuButtons currentPath={currentPath} variant={"mobile"} />
        </Stack>
      </Drawer>
    </>
  );
};

export default CustomToolbar;
