import React from "react";
import { Stack, Button, Grid, ThemeProvider, createTheme } from "@mui/material";
import { Link } from "react-router-dom";
import CategoryTable from "../../Components/Category/CategoryTable";

// Page for the category
const CategoryPage = () => {
  return (
    <div>
      <Grid style={{ padding: "1rem" }}>
        <Stack direction="row" justifyContent="end">
          <Link to="/add-category" style={{ textDecoration: "none" }}>
            <Button variant="outlined" color="primary">
              Add Category
            </Button>
          </Link>
        </Stack>
        <ThemeProvider theme={createTheme()}>
          {" "}
          <CategoryTable />
        </ThemeProvider>
      </Grid>
    </div>
  );
};

export default CategoryPage;
