import React from "react";
import Particles from "../Form/Particles";
import { Grid } from "@mui/material";

//This is the main layout for the entire project
const MainLayout = (props) => {
  const styles = {
    root: {
      textAlign: "center",
      height: "100%",
      background: "#222",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };
  return (
    <div style={styles.root}>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={6}>
          {props.children}
        </Grid>
      </Grid>

      {/* The particles here is the background in the logged in page*/}
      <Particles />
    </div>
  );
};

export default MainLayout;
