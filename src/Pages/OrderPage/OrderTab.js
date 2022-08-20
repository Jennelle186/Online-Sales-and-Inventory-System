import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import PendingOrders from "../../Components/OrderTable/PendingOrders";
import DeliveredOrders from "../../Components/OrderTable/DeliveredOrders";
import ReadyToBeDelivered from "../../Components/OrderTable/ReadyToBeDelivered";
import Cancelled from "../../Components/OrderTable/CancelledOrders";
import ReturnedOrders from "../../Components/OrderTable/ReturnedOrders";

import { Link } from "react-router-dom";

// these are the different order tabs

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

const OrderTab = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  //useEffect is used to determine which current tab is active even if reloaded
  useEffect(() => {
    let path = window.location.pathname;
    if (path === "/Order/Pending-Orders" && value !== 0) setValue(0);
    else if (path === "/Order/Ready-to-be-delivered" && value !== 1)
      setValue(1);
    else if (path === "/Order/Delivered-Orders" && value !== 2) setValue(2);
    else if (path === "/Order/Cancelled" && value !== 3) setValue(3);
    else if (path === "/Order/Returned" && value !== 4) setValue(4);
  }, [value]); //value is the dependency array as value changes upon which tab is selected

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
          variant="scrollable"
        >
          <Tab
            label="Pending"
            {...a11yProps(0)}
            to="/Order/Pending-Orders"
            component={Link}
          />
          <Tab
            label="Ready to be Delivered"
            {...a11yProps(1)}
            to="/Order/Ready-to-be-delivered"
            component={Link}
          />
          <Tab
            label="Delivered"
            {...a11yProps(2)}
            to="/Order/Delivered-Orders"
            component={Link}
          />
          <Tab
            label="Cancelled"
            {...a11yProps(3)}
            to="/Order/Cancelled"
            component={Link}
          />
          <Tab
            label="Returned"
            {...a11yProps(4)}
            to="/Order/Returned"
            component={Link}
          />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <PendingOrders />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <ReadyToBeDelivered />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DeliveredOrders />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <Cancelled />
      </TabPanel>
      <TabPanel value={value} index={4}>
        <ReturnedOrders />
      </TabPanel>
    </Box>
  );
};

export default OrderTab;
