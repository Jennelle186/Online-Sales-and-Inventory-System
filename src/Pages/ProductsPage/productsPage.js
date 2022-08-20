// Page of the products that holds the button or navigation to add a product.
//also contains the tab for the list of the products and the list of the history of the products
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Stack,
  Button,
  Grid,
  ThemeProvider,
  createTheme,
  Tabs,
  Tab,
  Typography,
  Box,
} from "@mui/material";
import { Link } from "react-router-dom";
import ProductTable from "../../Components/ProductTable/ProductTable";

import History from "../../Components/HistoryofProducts/history";

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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const ProductsPage = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //useEffect is used to determine which current tab is active even if reloaded
  useEffect(() => {
    let path = window.location.pathname;
    if (path === "/Products" && value !== 0) setValue(0);
    else if (path === "/Products/History" && value !== 1) setValue(1);
  }, [value]); //value is the dependency array as value changes upon which tab is selected

  return (
    <div>
      <Grid style={{ padding: "1rem" }}>
        <Stack direction="row" justifyContent="end">
          <Link
            to="/add-products"
            style={{ textDecoration: "none", marginRight: "1rem" }}
          >
            <Button variant="outlined" color="primary">
              Add Product
            </Button>
          </Link>

          <Link to="/category" style={{ textDecoration: "none" }}>
            <Button variant="outlined" color="secondary">
              Category
            </Button>
          </Link>
        </Stack>{" "}
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab
                label="Products"
                {...a11yProps(0)}
                to="Products"
                component={Link}
              />
              <Tab
                label="History of the Products"
                {...a11yProps(0)}
                to="/Products/History"
                component={Link}
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <ThemeProvider theme={createTheme()}>
              {" "}
              <ProductTable />
            </ThemeProvider>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <History />
          </TabPanel>
        </Box>
      </Grid>
    </div>
  );
};

export default ProductsPage;
