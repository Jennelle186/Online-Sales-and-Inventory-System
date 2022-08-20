import React from "react";

import Header from "../Header/Header";
import OrderReport from "../OrderTable/today";
import BoxDashboards from "../BoxDashboard/BoxDashboard";

import { Grid, Button } from "@mui/material";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import pdf from "../../assets/User-Manual.pdf";

// The component for the homepage
const Homepage = () => {
  return (
    <>
      {/* The component for the header */}
      <Header />

      <Grid style={{ padding: "1rem" }}>
        {/* This is where the pdf is located  */}
        <a href={pdf} target="_blank" style={{ textDecoration: "none" }}>
          <Button variant="outlined" startIcon={<MenuBookIcon />}>
            User Manual
          </Button>
        </a>

        <OrderReport />
      </Grid>
    </>
  );
};

export default Homepage;
