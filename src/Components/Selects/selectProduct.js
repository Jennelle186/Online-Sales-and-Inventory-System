import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const SelectProduct = ({ value, onChange, names }) => {
  //do not show the value of category if it is === S-XL
  const options = names.map(
    (object) =>
      object.prodName +
      " - " +
      object.size +
      `${object.cat === "CM" || object.cat === "ML" ? "- " + object.cat : ""}` +
      " "
    // +
    // object.color
  );

  return (
    <>
      <Autocomplete
        disablePortal
        isOptionEqualToValue={(option, value) => option?.label === value?.label}
        id="combo-box-demo"
        options={options}
        fullWidth
        value={value}
        onChange={onChange}
        renderInput={(params) => <TextField {...params} label="Products" />}
        required
      />
    </>
  );
};

export default SelectProduct;
