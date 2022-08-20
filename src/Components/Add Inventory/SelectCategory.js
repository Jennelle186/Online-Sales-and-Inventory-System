import React from "react";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const SelectCategory = ({ value, onChange, category }) => {
  return (
    <div>
      <FormControl fullWidth>
        <InputLabel htmlFor="category">Category</InputLabel>
        <Select value={value} onChange={onChange} fullWidth>
          {category &&
            category.map((index) => (
              <MenuItem
                key={index.cat}
                value={index.cat}
                // defaultValue={}
              >
                {index.cat}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default SelectCategory;
