import * as React from "react";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { useMetadataContext } from "context/MetadataContext";
import { capitalizeEachWord } from "utils/helper";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// const items = ["Flood", "Earthquake", "Cyclone", "Landslides"];

function getStyles(item, itemName, theme) {
  return {
    fontWeight:
      itemName.indexOf(item) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
const uniqueArray = (array) => Array.from(new Set(array));

export default function MultipleSelectChip({ itemName, setItemName }) {
  // const items = ["Flood", "Earthquake", "Cyclone", "Landslides"];

  //Get unique tags
  const metadata = useMetadataContext();
  var nonUniqueArray = [];
  metadata?.forEach((event_item) => {
    nonUniqueArray = nonUniqueArray.concat(event_item.event_type_tags);
  });
  const items = uniqueArray(nonUniqueArray).map((str) => {
    return capitalizeEachWord(str);
  });

  const theme = useTheme();

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setItemName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div style={{ width: "100%" }}>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel id="demo-multiple-chip-label">Category</InputLabel>
        <Select
          labelId="demo-multiple-chip-label"
          id="demo-multiple-chip"
          multiple
          style={{ borderRadius: "20px" }}
          value={itemName}
          onChange={handleChange}
          input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
          MenuProps={MenuProps}
        >
          {items.map((item) => (
            <MenuItem
              key={item}
              value={item}
              style={getStyles(item, itemName, theme)}
            >
              {item}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
