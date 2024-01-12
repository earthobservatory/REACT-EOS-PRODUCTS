import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Modal,
  Stack,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { GeoJSON, MapContainer, Rectangle, TileLayer } from "react-leaflet";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import MuiAppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";
import { styled, useTheme } from "@mui/material/styles";
import { HEADER_HEIGHT } from "utils/constants";

import GetAppIcon from "@mui/icons-material/GetApp";
import SatelliteAltRoundedIcon from "@mui/icons-material/SatelliteAltRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import CustomToolbar from "components/AppHeader/Toolbar";
import CVDSwitch from "components/Reusables/CVDSwitch";
import { CustomPopup } from "components/Reusables/CustomCard";
import { useMetadataContext } from "context/MetadataContext";
import { useParams } from "react-router-dom";
import { handleDownload } from "utils/helper";
import {
  FloatingSideButton,
  FloatingSidePeekCard,
} from "../../components/MapPage/FloatingSideCard";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

const drawerWidth = 400;

const DownloadsPopup = ({ open, downloads, onClose }) => {
  return (
    <Modal open={open} onClose={onClose} sx={{ zIndex: 100000 }}>
      <CustomPopup sx={{ maxHeight: "80%", width: "80%" }}>
        <Typography color={"primary"} variant="h4" fontWeight="400">
          Downloads
        </Typography>
        <List sx={{ overflowY: "scroll" }}>
          {downloads.map((item, index) => (
            <>
              <ListItem key={index}>
                <SatelliteAltRoundedIcon
                  color="primary"
                  sx={{ marginRight: "1rem" }}
                />

                <ListItemText>
                  <Typography sx={{ wordBreak: "break-all" }}>
                    {item.prod_name}
                  </Typography>
                </ListItemText>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Button
                    aria-label={`Download PNG - ${item.prod_name}`}
                    onClick={() => handleDownload(item.prod_main_png)}
                  >
                    <GetAppIcon />
                    <Typography variant="body2">PNG</Typography>
                  </Button>
                  <Button
                    aria-label={`Download TIFF - ${item.prod_name}`}
                    onClick={() => handleDownload(item.prod_tif)}
                  >
                    <GetAppIcon />
                    <Typography variant="body2">TIFF</Typography>
                  </Button>
                  <Button
                    aria-label={`Download KMZ - ${item.prod_name}`}
                    onClick={() => handleDownload(item.prod_kmz)}
                  >
                    <GetAppIcon />
                    <Typography variant="body2">KMZ</Typography>
                  </Button>
                </div>
              </ListItem>
              {item?.cvd_prod_tiles ? (
                <ListItem key={index} sx={{ display: "flex" }}>
                  <VisibilityRoundedIcon
                    color="navyblue"
                    sx={{ marginRight: "1rem" }}
                  />
                  <ListItemText>
                    <Typography sx={{ wordBreak: "break-all" }}>
                      {item.cvd_prod_name}
                    </Typography>
                  </ListItemText>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Button
                      color="navyblue"
                      aria-label={`Download CVD PNG - ${item.cvd_prod_name}`}
                      onClick={() => handleDownload(item.cvd_prod_main_png)}
                    >
                      <GetAppIcon />
                      <Typography variant="body2">PNG</Typography>
                    </Button>
                    <Button
                      color="navyblue"
                      aria-label={`Download CVD TIFF - ${item.cvd_prod_name}`}
                      onClick={() => handleDownload(item.cvd_prod_tif)}
                    >
                      <GetAppIcon />
                      <Typography variant="body2">TIFF</Typography>
                    </Button>
                    <Button
                      color="navyblue"
                      aria-label={`Download CVD KMZ - ${item.cvd_prod_name}`}
                      onClick={() => handleDownload(item.cvd_prod_kmz)}
                    >
                      <GetAppIcon />
                      <Typography variant="body2">KMZ</Typography>
                    </Button>
                  </div>
                </ListItem>
              ) : (
                <></>
              )}

              <Divider />
            </>
          ))}
        </List>
        <IconButton
          aria-label="Close"
          style={{ position: "absolute", top: 5, right: 5 }}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      </CustomPopup>
    </Modal>
  );
};

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
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
  // backgroundColor: `#424242AA`,
  backgroundColor: "black",
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
}));

const getCenterPoint = (event_bbox) => {
  return [
    (event_bbox[0][0] + event_bbox[1][0]) / 2.0,
    (event_bbox[0][1] + event_bbox[1][1]) / 2.0,
  ];
};

const DisclaimerPopup = ({ drawerIsOpen }) => {
  const [open, setOpen] = useState(false);
  const [closeWarning, setCloseWarning] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseWarning = () => {
    setCloseWarning(true);
  };

  return (
    <>
      <Box
        sx={{
          visibility: closeWarning ? "hidden" : "none",
          position: "absolute",
          bottom: "5%",
          left: drawerIsOpen ? `calc( 50% + ${drawerWidth}px / 2)` : "50%",
          zIndex: 1000,
          backgroundColor: "#32323288",
          transform: "translate(-50%, -50%)",
          borderRadius: "5px",
          padding: "1rem",
          backdropFilter: "blur(8px)",
          display: "flex",
        }}
      >
        <Typography>
          This map is provided for general information purpose only.
          <br />
          By using EOS-RS maps, you agree to our{" "}
          <Link
            variant="contained"
            color="primary"
            onClick={handleOpen}
            sx={{ fontWeight: 800, cursor: "pointer" }}
          >
            terms of use
          </Link>
        </Typography>
        <IconButton onClick={handleCloseWarning} sx={{ height: "fit-content" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        sx={{ zIndex: 10000 }}
        color=""
        PaperProps={{
          style: {
            // backgroundColor: "#e80c1a66",
            borderRadius: "5px",
            padding: "1rem",
            backdropFilter: "blur(8px)",
          },
        }}
      >
        <DialogTitle color={"primary"}>Legal Disclaimer</DialogTitle>
        <DialogContent>
          <DialogContentText>
            While EOS-RS has made reasonable efforts to ensure the accuracy of
            the information presented, EOS-RS makes no representations or
            warranties of any kind, express or implied, about the completeness,
            accuracy, reliability, suitability, or availability with respect to
            the map or the information, products, services, or related graphics
            contained on the map for any purpose. Any reliance you place on such
            information is therefore strictly at your own risk.
            <br />
            In no event will EOS-RS be liable for any profits, loss of goodwill,
            loss of use, loss of production or business interruption costs, or
            any type of indirect, special, consequential, or incidental damages
            arising in connection with the use of this map.
            <br />
            Please use this map responsibly and consult official sources for any
            decision-making. If you have any questions or concerns about the map
            or its content, please contact us at{" "}
            <Link
              sx={{ color: "primary", cursor: "pointer" }}
              href="mailto:eos-rs@ntu.edu.sg"
            >
              eos-rs@ntu.edu.sg
            </Link>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary" variant="outlined">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

function LeafletPage(props) {
  const theme = useTheme();
  const [state, setState] = useState();
  const metadata = useMetadataContext();
  const { event_name } = useParams();
  const [checked, setChecked] = useState([]);
  const [jsonData, setJsonData] = useState({});
  const [products, setProducts] = useState([]);
  const [sidebarDescription, setSidebarDescription] = useState({});
  const [open, setOpen] = useState(false);
  const [openLayers, setOpenLayers] = useState(false);
  const [openDownload, setOpenDownload] = useState(false);

  const geoJsonRef = useRef();

  const handleOpenDownload = () => {
    if (checked.length) {
      setOpenDownload(true);
    } else {
      enqueueSnackbar("Please select at least 1 product", { variant: "info" });
    }
  };

  const handleCloseDownload = () => {
    setOpenDownload(false);
  };

  const GeoJSONMap = (url) => {
    fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        var newObj = jsonData;
        newObj[url] = data;
        setJsonData(newObj);
      });
  };

  useEffect(() => {
    if (event_name && metadata) {
      const event_metadata = metadata?.find((events) => {
        return events.event_name == event_name;
      });

      setState({
        event: event_metadata,
        product_list: event_metadata.product_list,
      });
    }
  }, [event_name, metadata]);

  useEffect(() => {
    if (state) {
      var finalList = [];
      var productList = state?.product_list;

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
            const cvd_metadata = cvd[0];
            finalList.push({
              ...item,
              cvd_prod_tiles: cvd_metadata.prod_tiles,
              cvd_prod_kmz: cvd_metadata.prod_kmz,
              cvd_prod_main_png: cvd_metadata.prod_main_png,
              cvd_prod_name: cvd_metadata.prod_name,
              cvd_prod_rfp_file: cvd_metadata.prod_rfp_file,
              cvd_prod_tif: cvd_metadata.prod_tif,
              cvd_selected: false,
            });
          } else {
            finalList.push({ ...item, cvd_selected: false });
          }
        });

      setSidebarDescription({
        title: state?.product_list[0].prod_title,
        description: decodeURIComponent(
          escape(state?.product_list[0].prod_desc)
        ),
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

    if (currentIndex === -1) {
      var productIndex = products.indexOf(value);
      products[productIndex].cvd_selected = newVal.target.checked;
      // setProducts()
    } else {
      newChecked[currentIndex].cvd_selected = newVal.target.checked;
    }

    setChecked(newChecked);
  };

  const handleSideBarDisplay = (title, description) => {
    setSidebarDescription({ title: title, description: description });
    handleDrawerOpen();
  };

  const onEachClick = (feature, layer, title, description) => {
    // const name = feature.properties.name;
    // const density = feature.properties.density;

    layer.on({
      click: (e) => {
        handleFeatureClick(e, title, description);
      },
    });
  };

  const handleFeatureClick = (e, title, description) => {
    setOpenLayers(false);
    if (!geoJsonRef.current) return;
    geoJsonRef.current.resetStyle();

    const layer = e.target;
    handleSideBarDisplay(title, description);

    layer.setStyle({ color: "#cc7076AA" });
  };

  return (
    <>
      {state ? (
        <Box sx={{ display: "flex" }}>
          <CssBaseline />
          <DownloadsPopup
            open={openDownload}
            onClose={handleCloseDownload}
            downloads={checked}
          />
          <FloatingSideButton
            isOpen={openLayers}
            onClick={() => {
              setOpenLayers(!openLayers);
            }}
          />
          <FloatingSidePeekCard isOpen={openLayers}>
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
            <Stack
              sx={{
                padding: "0.5rem",
                gap: "1rem",
                overflow: "auto",
                flex: 1,
              }}
            >
              <List key={"list-component"} dense sx={{ width: "100%" }}>
                {products
                  .filter((item) => {
                    // console.log(item);
                    return item.isLatest;
                  })
                  .map((value, index) => {
                    const labelId = `checkbox-list-${value}-${index}`;
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
                            primary={decodeURIComponent(
                              escape(value.prod_title)
                            )}
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
            <Button variant="outlined" fullWidth onClick={handleOpenDownload}>
              Download Selected
            </Button>
          </FloatingSidePeekCard>
          <AppBar position="fixed" open={open}>
            <CustomToolbar
              isMapPage
              handleDrawerOpen={handleDrawerOpen}
              open={open}
            />
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
              <Typography
                variant="h5"
                sx={{ overflowWrap: "anywhere" }}
                color={"primary"}
              >
                {state.event?.event_display_name}
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
              <Typography variant="h5" sx={{ textDecoration: "underline" }}>
                Product Description
              </Typography>
              <Typography variant="h6" sx={{ lineBreak: "anywhere" }}>
                {decodeURIComponent(escape(sidebarDescription?.title))}
              </Typography>
              <Typography sx={{ whiteSpace: "pre-wrap" }}>
                {sidebarDescription?.description}
              </Typography>
            </Stack>
            <Divider />
          </Drawer>
          <Main open={open}>
            <DrawerHeader />

            <Box>
              <DisclaimerPopup drawerIsOpen={open} />
              <MapContainer
                style={{
                  height: `calc(95vh - ${HEADER_HEIGHT})`,
                  borderRadius: "1rem",
                }}
                // center={getCenterPoint(state.event.event_bbox)}

                bounds={state?.event?.event_bbox}
                zoom={10}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}"
            /> */}

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
                        maxNativeZoom={parseInt(item?.prod_max_zoom)}
                        minNativeZoom={parseInt(item?.prod_min_zoom)}
                      />
                      <GeoJSON
                        style={{ color: "#be93e677", weight: 2 }}
                        ref={geoJsonRef}
                        onEachFeature={(feature, layer) => {
                          onEachClick(
                            feature,
                            layer,
                            decodeURIComponent(escape(item?.prod_title)),
                            decodeURIComponent(escape(item?.prod_desc))
                          );
                        }}
                        key={item?.prod_rfp_file}
                        data={jsonData[item?.prod_rfp_file]}
                      >
                        {/* <Popup>
                      <Box sx={{ maxHeight: "20rem", overflowY: "scroll" }}>
                        {decodeURIComponent(escape(item?.prod_desc))}
                      </Box>
                    </Popup> */}
                      </GeoJSON>
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
                  bounds={state?.event?.event_bbox}
                  pathOptions={{ color: "white", fill: false, weight: 5 }}
                />
              </MapContainer>
            </Box>
          </Main>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}

export default LeafletPage;
