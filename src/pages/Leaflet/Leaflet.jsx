import { Box, Button, Stack, Fab, Checkbox, Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  GeoJSON,
  useMap,
  Marker,
  Popup,
  LayersControl,
  Rectangle,
} from "react-leaflet";

import { styled, useTheme } from "@mui/material/styles";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { HEADER_HEIGHT } from "utils/constants";
import { getRoute } from "utils/routes";
import logo from "assets/EOS Logo.png";
import { json, useLocation, useNavigate } from "react-router-dom";
import ProductCard from "components/ProductCard/ProductCard";
import Noise from "assets/noise.svg";
import CVDSwitch from "components/Reusables/CVDSwitch";

const FloatingSidePeekPopup = ({ children, isOpen, onClose }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        right: 0,
        zIndex: 9999,
        width: "35vw",
        // transform: "translateY(-50%)",
        transform: isOpen ? "translate(0, -50%)" : "translate(100%, -50%)",
        transition: "transform 0.3s ease-in-out",
        height: "60vh",
        background: "rgba(235, 253, 255, 0.55)",
        borderRadius: "16px",
        boxShadow: " 0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(109, 240, 255, 0.29)",
        overflowY: "scroll",
        padding: "1rem",
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
      {/* <Fab
        color="primary"
        sx={{
          position: "fixed",
          top: "50%",
          left: 0,
          translate: "translateX(-50%)",
        }}
      >
        <ArrowForwardIcon />
      </Fab> */}
      {children}
    </Box>
  );
};

const FloatingSideButton = ({ children, isOpen, onClick }) => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: "50%",
        right: -10,
        zIndex: 9999,
        // width: "",
        // transform: "translateY(-50%)",
        transform: isOpen ? "translate(100%, -50%)" : "translate(0, -50%)",
        transition: "transform 0.3s ease-in-out",
        // height: "60vh",
        background: "rgba(235, 253, 255, 0.55)",
        borderRadius: "16px",
        boxShadow: " 0 4px 30px rgba(0, 0, 0, 0.1)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(109, 240, 255, 0.29)",

        padding: "1rem",
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
      <IconButton onClick={onClick}>
        <ChevronLeftIcon />
      </IconButton>
    </Box>
  );
};

const drawerWidth = 480;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    "&:after": {
      content: "''",
      background: `url(${Noise})`,
      position: "absolute",
      top: "0px",
      left: "0px",
      width: "100%",
      height: "100%",
      zIndex: -1,
      opacity: 0.12 /* Here is your opacity */,
    },
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  })
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  height: HEADER_HEIGHT,
  transition: theme.transitions.create(["margin", "width"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
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
}));

const getCenterPoint = (event_bbox) => {
  return [
    (event_bbox[0][0] + event_bbox[1][0]) / 2.0,
    (event_bbox[0][1] + event_bbox[1][1]) / 2.0,
  ];
};

function LeafletPage(props) {
  const Navigate = useNavigate();
  const { state } = useLocation();
  const [checked, setChecked] = useState([]);
  const [jsonData, setJsonData] = useState({});

  const [products, setProducts] = useState([]);

  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [openLayers, setOpenLayers] = useState(false);

  const GeoJSONMap = (url) => {
    console.log(url);
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        var newObj = jsonData;
        newObj[url] = data;
        console.log(newObj);
        setJsonData(newObj);
      });
  };

  useEffect(() => {
    var productList = state?.product_list;
    if (productList) {
      var finalList = [];
      productList
        .filter((filter) => {
          return filter.prod_cvd === false;
        })
        .forEach((item) => {
          GeoJSONMap(item.prod_rfp_file);
          var cvd = productList.filter((filter) => {
            return filter.prod_name === `${item.prod_name}_cvd`;
          });
          if (cvd.length) {
            finalList.push({
              ...item,
              cvd_prod_tiles: cvd[0].prod_tiles,
              cvd_selected: false,
            });
          } else {
            finalList.push({ ...item, cvd_selected: false });
          }
        });

      setProducts(finalList);
      setOpenLayers(true);
    }
  }, [state]);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleSwitch = (value, newVal) => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    console.log(checked);

    if (currentIndex === -1) {
      var productIndex = products.indexOf(value);
      products[productIndex].cvd_selected = newVal.target.checked;
      // setProducts()
    } else {
      newChecked[currentIndex].cvd_selected = newVal.target.checked;
    }

    console.log(newChecked);

    setChecked(newChecked);
  };

  function EOSIcon(props) {
    return (
      <img
        resizeMode="contain"
        src={logo}
        alt="logo"
        style={{ width: "165px", height: "64px" }}
      />
    );
  }

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <FloatingSideButton
        isOpen={openLayers}
        onClick={() => {
          setOpenLayers(!openLayers);
        }}
      />
      <FloatingSidePeekPopup isOpen={openLayers}>
        <Stack sx={{ padding: "0.5rem", gap: "1rem" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => {
                setOpenLayers(!openLayers);
              }}
            >
              <ChevronRightIcon />
            </IconButton>
            <Typography variant="h5">Products</Typography>
          </Box>

          <List dense sx={{ width: "100%" }}>
            {products
              .filter((item) => {
                return item.isLatest;
              })
              .map((value, index) => {
                const labelId = `checkbox-list-${value}-${index}`;
                console.log(value?.cvd_prod_tiles);
                return (
                  <ListItem key={labelId} disablePadding>
                    <ListItemButton onClick={handleToggle(value)}>
                      <ListItemIcon>
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(value)}
                          checked={checked.indexOf(value) !== -1}
                          inputProps={{ "aria-labelledby": labelId }}
                        />
                      </ListItemIcon>

                      {/* <ListItemAvatar>
                        <Avatar
                          alt={`Avatar n°${value + 1}`}
                          src={value.prod_main_png}
                        />
                      </ListItemAvatar> */}
                      <ListItemText
                        id={labelId}
                        primary={decodeURIComponent(escape(value.prod_title))}
                      />
                      {value?.cvd_prod_tiles ? (
                        <CVDSwitch
                          onChange={(newVal) => {
                            handleSwitch(value, newVal);
                          }}
                          checked={value.cvd_selected}
                          edge="end"
                        />
                      ) : (
                        <></>
                      )}
                    </ListItemButton>
                  </ListItem>
                );
              })}
          </List>
          {/* {state?.product_list
            .filter((item) => {
              return item.isLatest;
            })
            .map((item) => {
              return (
                <ProductCard
                  Title={item.prod_title}
                  Image={item.prod_main_png}
                  Date={item.prod_date}
                  Description={item.prod_desc}
                ></ProductCard>
              );
            })} */}
        </Stack>
      </FloatingSidePeekPopup>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Button
            onClick={() => {
              Navigate(getRoute("landing"));
            }}
          >
            <EOSIcon size={54} />
          </Button>
          <Typography
            variant="h5"
            color="white"
            sx={{ flexGrow: 1, fontWeight: 800, letterSpacing: 3, ml: "1%" }}
          >
            EOS-RS
          </Typography>
          <Button
            onClick={() => {
              Navigate(getRoute("home"));
            }}
          >
            <Typography color="white" sx={{ fontWeight: 500 }}>
              About Us
            </Typography>
          </Button>
          <Button>
            <Typography color="white" sx={{ fontWeight: 500 }}>
              How to use
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant="persistent"
        anchor="left"
        open={open}
      >
        <DrawerHeader>
          <Typography variant="h5" sx={{ overflowWrap: "anywhere" }}>
            {state.event.event_display_name}
          </Typography>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? (
              <ChevronLeftIcon />
            ) : (
              <ChevronRightIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <Stack sx={{ padding: "1rem", gap: "1rem" }}>
          <Typography variant="h5">Description</Typography>
          <Typography>
            {decodeURIComponent(escape(state?.product_list[0].prod_desc))}
          </Typography>
        </Stack>
        {/* <List>

          {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
        <Divider />
      </Drawer>
      <Main open={open}>
        <DrawerHeader />
        <Box>
          <MapContainer
            style={{
              height: `calc(95vh - ${HEADER_HEIGHT})`,
              borderRadius: "1rem",
            }}
            // center={getCenterPoint(state.event.event_bbox)}

            bounds={state.event.event_bbox}
            zoom={10}
            scrollWheelZoom={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {checked.map((item) => {
              return (
                <>
                  <TileLayer
                    tms={true}
                    url={
                      item?.cvd_selected
                        ? `${item?.cvd_prod_tiles}{z}/{x}/{y}.png`
                        : `${item?.prod_tiles}{z}/{x}/{y}.png`
                    }
                    maxNativeZoom={item?.prod_max_zoom}
                    minNativeZoom={item?.prod_min_zoom}
                  />
                  <GeoJSON
                    style={{ color: "#ff780099", weight: 2 }}
                    key={item?.prod_rfp_file}
                    data={jsonData[item?.prod_rfp_file]}
                  />
                </>
              );
            })}

            {/* <LayersControl position="topright">
              <LayersControl.Overlay name="Afghanistan Earthquake">
                <TileLayer
                  name="Afghanistan Earthquake"
                  tms={true}
                  url={`${state?.product_list[0].prod_tiles}{z}/{x}/{y}.png`}
                  maxNativeZoom={14}
                  minNativeZoom={6}
                />
              </LayersControl.Overlay>
            </LayersControl> */}

            <Rectangle
              bounds={state.event.event_bbox}
              pathOptions={{ color: "yellow", fill: false }}
            />
          </MapContainer>
        </Box>
      </Main>
    </Box>
  );
}

export default LeafletPage;
