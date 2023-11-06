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
} from "@mui/material";
import EventCard from "components/EventCard/EventCard";
import { Search, FilterList } from "@mui/icons-material";
import { getRoute } from "utils/routes";
import { useNavigate } from "react-router-dom";
import { convertToHierarchy } from "utils/DirectoryListing";
import XMLParser from "react-xml-parser";
import { useMetadataContext } from "context/MetadataContext";
import Noise from "assets/noise.svg";
import moment from "moment";
import { motion } from "framer-motion";
import ScaleUpOnHover from "utils/Animations/ScaleUpOnHover";
import MultipleSelectChip from "components/Reusables/MultiSelect";
import BACKGROUND_IMG from "assets/EOS_PRODUCT.png";
import EOS_RS_LOGO from "assets/EOS-RS-Logo.png";
import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

const HomePage = () => {
  const metadata = useMetadataContext();
  const Navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [startDate, setStartDate] = useState(moment().subtract(6, "months"));
  const [endDate, setEndDate] = useState(moment());
  const [filter, setFilter] = useState([]);

  const handleChange = (event) => {
    setQuery(event.target.value);
  };

  const mostRecentMetadata = metadata?.filter((item) => {
    const itemDate = moment(item.event_start);
    return itemDate.isAfter(startDate) && itemDate.isBefore(endDate);
  });

  const filteredMetadata = metadata?.filter((item) => {
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
          Date={`${item.event_start} | ${item.event_end}`}
          LastUpdated={latestProduct.prod_date}
          Tags={item.event_type_tags}
          key={item.event_display_name}
          onClick={() => {
            Navigate(getRoute("leaflet"), {
              state: {
                event: item,
                product_list: item.product_list,
              },
            });
          }}
        />
      );
    });
  };

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

  return (
    <Box>
      <AppHeader />
      <Box
        sx={{
          backgroundImage: `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05)), url(${BACKGROUND_IMG})`,
          backgroundSize: "contain",
          display: "flex",
          width: "100vw",
          height: "100vh",
        }}
      >
        <Box
          sx={{
            backdropFilter: "blur(2px)",
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {/* <Typography variant="h4" textAlign="center" color="white">
          EOS-RS
        </Typography> */}
          <img src={EOS_RS_LOGO} height={"80px"} />
          <Typography
            variant="h5"
            textAlign="center"
            width="60%"
            // fontWeight="800"
            color="white"
          >
            The EOS Remote Sensing Lab (EOS-RS) is a flagship laboratory at the
            Earth Observatory of Singapore. We use satellite remote-sensing data
            for rapid disaster response and hazard monitoring.
          </Typography>
          <Button
            variant="outlined"
            // type="primary"

            color="secondary"
            sx={{ width: "50%", borderRadius: "5rem", marginTop: "2rem" }}
            // onClick={() => {
            //   Navigate(getRoute("home"));
            // }}
            href="https://earthobservatory.sg/research/centres-labs/eos-rs"
          >
            Click to read more about EOS-RS
          </Button>
          <IconButton size="large">
            <KeyboardDoubleArrowDownIcon />
          </IconButton>
        </Box>
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
        <Box>
          <Typography variant="h3" fontWeight="800">
            Recent events
          </Typography>
          <Typography variant="h6">Events in the last 6 months</Typography>
          <Grid
            sx={{ padding: "1rem" }}
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 2, sm: 8, md: 12 }}
          >
            {MapEventCards(mostRecentMetadata)}
          </Grid>
        </Box>

        <Box sx={{ minHeight: "80vh" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h3" fontWeight="800">
                All events
              </Typography>
              <Typography variant="h6">Click to view</Typography>
            </Box>

            <Stack direction={"row"} alignItems={"center"}>
              <MultipleSelectChip itemName={filter} setItemName={setFilter} />

              <TextField
                label="Search"
                variant="outlined"
                size="small"
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
            </Stack>
          </Box>
          <Grid
            sx={{ padding: "1rem" }}
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 2, sm: 8, md: 12 }}
          >
            <Grid
              sx={{ padding: "1rem" }}
              container
              spacing={{ xs: 2, md: 3 }}
              columns={{ xs: 2, sm: 8, md: 12 }}
            >
              {MapEventCards(filteredMetadata)}
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Box>
  );
};

export default HomePage;
