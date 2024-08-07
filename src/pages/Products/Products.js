import React from "react";
import { API, HEADER_HEIGHT } from "../../utils/constants";
import { useState, useEffect } from "react";
import AppHeader from "../../components/AppHeader/AppHeader";
import {
  Button,
  Box,
  LinearProgress,
  Grid,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Stack,
  Pagination,
  Link,
} from "@mui/material";
import EventCard from "components/EventCard/EventCard";
import { Search, FilterList } from "@mui/icons-material";
import { getDynamicRoute, getRoute } from "utils/routes";
import { useNavigate } from "react-router-dom";
import { convertToHierarchy } from "utils/DirectoryListing";
import XMLParser from "react-xml-parser";
import { useMetadataContext } from "context/MetadataContext";
import Noise from "assets/noise.svg";
import moment from "moment";
import { motion } from "framer-motion";
import ScaleUpOnHover from "utils/Animations/ScaleUpOnHover";
import MultipleSelectChip from "components/Reusables/MultiSelect";
import BACKGROUND_IMG from "assets/Sent1-ESA-ModifiedEOSRS.png";
import EOS_RS_LOGO from "assets/EOS-RS-Logo.png";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";
import NTU_LOGO from "assets/NTU-Logo.png";
import EOS_LOGO_WHITE from "assets/EOS-Logo-White.png";
import { capitalizeEachWord } from "utils/helper";
import CustomTypo from "components/Reusables/CustomTypo";
import TwitterIcon from "@mui/icons-material/Twitter";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

const fontWeight = 800;
const fontFamily = "Myriad Pro Bold";
const linkStyle = {
  color: "white",
  "&:hover": {
    backgroundColor: "transparent",
    color: "#ffbd59FF",
  },
  cursor: "pointer",
  fontFamily: fontFamily,
  fontWeight: fontWeight,
  lineHeight: 2,
  textDecoration: "none",
  boxShadow: "none",
};

const footerStyle = {
  color: "white",
  fontFamily: fontFamily,
  fontWeight: fontWeight,
  lineHeight: 2,
  textDecoration: "none",
  boxShadow: "none",
};

const iconStyle = { color: "#FFFFFF", fontSize: "25px" };

const itemsPerPage = 8;

const ProductsPage = () => {
  const metadata = useMetadataContext();
  const Navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState(moment().subtract(6, "months"));
  const [endDate, setEndDate] = useState(moment());
  const [filter, setFilter] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const [page, setPage] = useState(1);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const filteredMetadata = metadata
    ?.sort((a, b) => moment(b.event_start) - moment(a.event_start))
    ?.filter((item) => {
      return (
        item.product_list[0].prod_desc
          .toLowerCase()
          .includes(query.toLowerCase()) &&
        (filter.length == 0 ||
          item.event_type_tags.some((r) => {
            return filter.map((i) => i.toLowerCase()).includes(r);
          }))
      );
    });

  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredMetadata?.slice(startIndex, endIndex);

  useEffect(() => {
    setPage(1);
  }, [filteredMetadata?.length]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const mostRecentMetadata = metadata?.filter((item) => {
    const itemDate = moment(item.event_start);
    return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
  });

  const MapEventCards = (inputData) => {
    return inputData?.map((item) => {
      var latestProduct = item.product_list.find((data) => {
        return data.isLatest == true;
      });

      // console.log(item);
      return (
        <EventCard
          Title={item.event_display_name}
          Image={latestProduct.prod_main_png}
          Description={latestProduct.prod_desc}
          // Date={`${item.event_start} | ${item.event_end}`}
          EventDate={item.event_start}
          LastUpdated={latestProduct.prod_date}
          Tags={item.event_type_tags.map((str) => {
            return capitalizeEachWord(str);
          })}
          key={item.event_name}
          onClick={() => {
            Navigate(getDynamicRoute("leaflet", item.event_name));
          }}
        />
      );
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset;

      // If scrollTop is at the top, make the header transparent
      setIsScrolled(scrollTop !== 0);
    };

    // Add scroll event listener when component mounts
    window.addEventListener("scroll", handleScroll);

    // Cleanup the scroll event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []); // Empty dependency array means this effect runs only once after the component mounts

  // const getHighestVersion = (fileArray) => {
  //   const fileExtension = ".kmz";
  //   const versionRegex = /v(\d+.\d+)/;

  //   const filteredFiles = fileArray.filter((file) =>
  //     file.name.endsWith(fileExtension)
  //   );

  //   if (!filteredFiles.length) {
  //     return null;
  //   }

  //   const versionNumbers = filteredFiles.map((file) => {
  //     const match = file.name.match(versionRegex);
  //     return match ? parseFloat(match[1]) : 0;
  //   });

  //   const highestVersionNumber = Math.max(...versionNumbers);

  //   return highestVersionNumber;
  // };

  // const getImage = (parentFolder, fileArray, version) => {
  //   const fileExtension = "MAIN.png";
  //   const versionRegex = RegExp(`v` + String(version));

  //   const filteredFiles = fileArray.filter((file) =>
  //     file.name.endsWith(fileExtension)
  //   );

  //   if (!filteredFiles.length) {
  //     return null;
  //   }

  //   const results = filteredFiles.filter((file) => {
  //     const match = file.name.match(versionRegex);
  //     return match ? file.name : null;
  //   });

  //   if (results.length) {
  //     return getFileURL(parentFolder + "/" + results[0].name);
  //   } else {
  //     return null;
  //   }
  // };

  // const getDescription = (parentFolder, fileArray, version) => {
  //   const fileExtension = ".txt";
  //   const versionRegex = RegExp(`v` + String(version));

  //   const filteredFiles = fileArray.filter((file) =>
  //     file.name.endsWith(fileExtension)
  //   );

  //   if (!filteredFiles.length) {
  //     return null;
  //   }

  //   const results = filteredFiles.filter((file) => {
  //     const match = file.name.match(versionRegex);
  //     return match ? file.name : null;
  //   });

  //   if (results.length) {
  //     console.log(getFileURL(parentFolder + "/" + results[0].name));
  //     return getFileURL(parentFolder + "/" + results[0].name);
  //   } else {
  //     return null;
  //   }
  // };

  // const getDate = (fileName) => {
  //   const dateRegex = /(\d{4})(\d{2})/;

  //   const match = fileName.name.match(dateRegex);
  //   var months = [
  //     "January",
  //     "February",
  //     "March",
  //     "April",
  //     "May",
  //     "June",
  //     "July",
  //     "August",
  //     "September",
  //     "October",
  //     "November",
  //     "December",
  //   ];

  //   return { month: months[parseInt(match[2]) - 1], year: match[1] };
  // };

  // DEPRECATED FUNCTIONS
  // const getFileURL = (folderDirectory) => {
  //   return (
  //     `https://eos-rs-products.s3-ap-southeast-1.amazonaws.com/` +
  //     folderDirectory
  //   );
  // };

  // useEffect(() => {
  //   const response = fetch(
  //     "https://eos-rs-products.s3.ap-southeast-1.amazonaws.com/"
  //   )
  //     .then((response) => {
  //       return response.text();
  //     })
  //     .then((result) => {
  //       var xml = new XMLParser().parseFromString(result);
  //       var tempArray = [
  //         ...xml?.children.filter((objectData) => {
  //           return objectData.name == "Contents";
  //         }),
  //       ];
  //       setDirectoryArray(
  //         convertToHierarchy(
  //           tempArray.map((metadata) => {
  //             return metadata?.children[0].value;
  //           })
  //         )
  //       );
  //       return xml;
  //     });
  // }, []);

  // useEffect(() => {
  //   if (directoryArray != null) {
  //     console.log(directoryArray);
  //     // console.log(

  //     // );
  //   }
  // }, [directoryArray]);

  //console.log(convertToHierarchy(paths).children)
  // const [loading, setLoading] = useState(false);

  // if (isLoading) {
  //   return <LinearProgress />;
  // }

  const scrollToEvents = () => {
    let events = document.getElementById("events").getBoundingClientRect();
    // e.preventDefault(); // Stop Page Reloading
    events &&
      window.scrollTo({
        behavior: "smooth",
        top:
          events.top -
          document.body.getBoundingClientRect().top -
          parseInt(HEADER_HEIGHT, 10),
      });
  };

  return (
    <Box>
      <AppHeader isScrolled={isScrolled} />
      <Box
        sx={{
          backgroundImage: `url(${BACKGROUND_IMG})`,
          backgroundSize: "cover",
          backgroundPosition: "center bottom 30px",
          display: "flex",
          width: "100%",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            background:
              "linear-gradient(to bottom, #00000022 0%, #00000022 80%, #171717 98%)",
            flex: 1,
            display: "flex",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              transform: "translate3d(-50%,0,0)",
              left: "50%",
              bottom: { xl: "15%", lg: "15%", md: "8%", sm: "8%", xs: "8%" },
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: "1rem",
              width: { xs: "80%", md: "40%", lg: "50%" },
            }}
          >
            <img src={EOS_RS_LOGO} height={"80px"} />
            <CustomTypo
              textAlign="center"
              // fontWeight="800"
              color="white"
            >
              The EOS Remote Sensing Lab (EOS-RS) is a flagship laboratory at
              the Earth Observatory of Singapore, Nanyang Technological
              University. We use satellite remote-sensing data for rapid
              disaster response and hazard monitoring.
            </CustomTypo>
            <Button
              variant="outlined"
              // type="primary"

              color="primary"
              sx={{
                // width: "50%",
                paddingX: "2rem",
                borderRadius: "5rem",
                paddingY: "0.5rem",
                marginBottom: "1rem",
              }}
              onClick={scrollToEvents}
              // onClick={() => {
              //   Navigate(getRoute("home"));
              // }}
              // href="https://earthobservatory.sg/research/centres-labs/eos-rs"
            >
              View products
            </Button>
            <IconButton size="large" onClick={scrollToEvents}>
              <KeyboardDoubleArrowDownIcon />
            </IconButton>
          </Box>
        </Box>
        <CustomTypo
          sx={{
            position: "absolute",
            transform: "translate3d(-50%,0,0)",
            right: "2%",
            bottom: "5%",
            opacity: "70%",
          }}
          textAlign="center"
          // fontWeight="800"
          color="grey"
        >
          Photo: ©ESA
        </CustomTypo>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: " column",
          flexGrow: 1,
          padding: "2rem",
          gap: "3rem",
          paddingTop: HEADER_HEIGHT,
        }}
      >
        {/* <Box>
          <CustomTypo variant="h3" fontWeight="800">
            Recent events
          </CustomTypo>
          <CustomTypo variant="h6">Events in the last 6 months</CustomTypo>
          <Grid
            sx={{ padding: "1rem" }}
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 2, sm: 8, md: 12 }}
          >
            {MapEventCards(mostRecentMetadata)}
          </Grid>
        </Box> */}

        <Box sx={{ minHeight: "80vh" }}>
          <Grid
            container
            spacing={2}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Grid
              item
              xs={12}
              md={6}
              sx={{ display: "flex", flexDirection: "column" }}
              id={"events"}
            >
              <CustomTypo variant="h3" fontWeight="800">
                All events
              </CustomTypo>
              <CustomTypo variant="h6">Click to view</CustomTypo>
            </Grid>

            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MultipleSelectChip itemName={filter} setItemName={setFilter} />
            </Grid>
            <Grid
              item
              xs={12}
              md={3}
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                label="Search"
                variant="outlined"
                fullWidth
                // size="small"
                onChange={handleChange}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <Search />
                      </IconButton>
                    </InputAdornment>
                  ),
                  // endAdornment: (
                  //   <InputAdornment position="end">
                  //     <IconButton>
                  //       <FilterList />
                  //     </IconButton>
                  //   </InputAdornment>
                  // ),
                  style: { borderRadius: "20px" },
                }}
              />
            </Grid>
          </Grid>
          <Grid sx={{ padding: "1rem" }} container spacing={{ xs: 2, md: 3 }}>
            {MapEventCards(paginatedData)}
          </Grid>
          <Box width={"100%"} display={"flex"} justifyContent={"center"}>
            <Pagination
              // variant="outlined"
              color="primary"
              count={Math.ceil(filteredMetadata?.length / itemsPerPage)}
              page={page}
              onChange={handlePageChange}
              size="large"
            />
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          background: "linear-gradient(#032852,#021122 73.22%,#010810)",
          minHeight: "200px",
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          padding: 4,
        }}
      >
        <Grid container rowSpacing={4}>
          <Grid
            item
            md={3}
            xs={12}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <img src={EOS_LOGO_WHITE} height={"80px"} />
          </Grid>

          <Grid
            item
            md={3}
            xs={12}
            sx={{ display: "flex", justifyContent: "center" }}
          >
            <Stack>
              <Link href="mailto:eos-rs@ntu.edu.sg" sx={linkStyle}>
                Contact us
              </Link>
              <Link href="https://earthobservatory.sg" sx={linkStyle}>
                Earth Observatory of Singapore
              </Link>
              <Link href="https://www.ntu.edu.sg/ase" sx={linkStyle}>
                Asian School of the Environment
              </Link>
            </Stack>
          </Grid>

          <Grid
            item
            md={3}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Stack>
              <CustomTypo sx={{ fontWeight: 1000 }} style={footerStyle}>
                Follow Us
              </CustomTypo>
              <Stack direction={"row"} spacing={1}>
                {/* <Link
                  href="https://x.com/eos_rs?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <YouTubeIcon style={iconStyle} />
                </Link>

                <Link
                  href="https://x.com/eos_rs?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <InstagramIcon style={iconStyle} />
                </Link> */}

                <Link
                  href="https://x.com/eos_rs?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <TwitterIcon style={iconStyle} />
                </Link>

                {/* <Link
                  href="https://x.com/eos_rs?lang=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FacebookIcon style={iconStyle} />
                </Link> */}
              </Stack>
            </Stack>
          </Grid>

          <Grid
            item
            md={3}
            xs={12}
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Stack>
              <CustomTypo sx={{ fontWeight: 1000 }} style={footerStyle}>
                An institute of
              </CustomTypo>
              <img src={NTU_LOGO} style={{ width: "auto", height: "60px" }} />
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default ProductsPage;
