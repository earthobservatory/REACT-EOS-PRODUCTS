import * as React from "react";
import { Button } from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: "3%", backgroundColor: "dark le", borderRadius: 8 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function CTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: "100%", justifyContent: "center", mt: "3%" }}>
      <Tabs
        value={value}
        onChange={handleChange}
        aria-label="tabs example"
        centered
      >
        <Tab label="Class" {...a11yProps(0)} />
        <Tab label="Workshop" {...a11yProps(1)} />
      </Tabs>
      <TabPanel value={value} index={0}>
        <Typography variant="h6">
          We provide workshops with different levels of difficulty, suitable for
          all age groups. Be it for small classes or even company team
          trainings, we can provide a customised tech enabled learning
          experience for your organisation.
        </Typography>
        <Button variant="outlined" size={"large"} sx={{ mt: "1%" }}>
          Enquire now
        </Button>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <Typography variant="h6">
          With increasing digitalization and adoption of Internet 4.0, coding
          skills are in demand. We provide tech enhanced lessons that trains
          design thinking and core coding fundamentals. Lessons don't just stop
          after class - with Learnr Map, students can bring learning to the next
          level, driven by their interests. <br />
          <br />
          Learning has never been easier.
        </Typography>
        <Button variant="outlined" size={"large"} sx={{ mt: "1%" }}>
          Enquire now
        </Button>
      </TabPanel>
    </Box>
  );
}
