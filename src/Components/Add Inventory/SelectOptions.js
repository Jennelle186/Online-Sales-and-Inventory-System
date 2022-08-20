import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SelectOptions = ({ value, onChange, options }) => {
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel htmlFor="category">Options</InputLabel>
        <Select value={value} onChange={onChange} fullWidth>
          {options &&
            options.map((index) => (
              <MenuItem
                key={index}
                value={index}
                // defaultValue={}
              >
                {index}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectOptions;
