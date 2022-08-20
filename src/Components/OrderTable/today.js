import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItem,
  ListItemText,
  Typography,
  TableFooter,
  ThemeProvider,
  createTheme,
  Dialog,
  DialogContent,
} from "@mui/material";

import { db } from "../../Firebase/utils";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import BoxDashboards from "../BoxDashboard/BoxDashboard";
import StocksAlert from "../StocksAlerts/StocksAlert";

import Loading from "../Loading/loading";
import Print from "./print";

const OrderReport = () => {
  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    //retrieves all of the orders and sets to to descending order
    const getOrders = async () => {
      // const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, orderBy("orderCreatedAt", "desc"));
      const querySnapshot = await getDocs(q);
      const arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      if (isMounted) {
        setOrders(arr);
        setLoading(true);
      }
    };

    getOrders().catch((err) => {
      if (!isMounted) return;
      console.error("failed to fetch data", err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  //these are the column headers or names
  const columns = [
    {
      name: "id",
      label: "Order ID", //or the order ID here
      options: {
        filter: false,
        display: false,
      },
    },
    {
      name: "firstName",
      label: "Name",
      options: {
        filter: false,
        display: false,
      },
    },

    {
      name: "lastName",
      label: "Full Name",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return <div>{tableMeta.rowData[1] + " " + tableMeta.rowData[2]}</div>;
        },
      },
    },
    {
      name: "houseNo",
      label: "HouseNo",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "streetAddress",
      label: "House No & Street Address",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              {tableMeta.rowData[3]} - {tableMeta.rowData[4]}
            </div>
          );
        },
      },
    },
    {
      name: "barangay",
      label: "Barangay",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "landMark",
      label: "Landmark",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "cartItems",
      label: "Orders",
      options: {
        filter: false,
        sort: false,
        display: false,
        viewColumns: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value;
        },
      },
    },
    {
      name: "cartItems",
      label: "Orders",
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return Object.entries(
            value.reduce((prev, item) => {
              if (!prev[item.id]) prev[item.id] = { ...item, nest: [] };
              prev[item.id].nest.push(item);
              return prev;
            }, {})
          ).map(([id, obj], idx) => (
            <List key={id + obj.color}>
              <ListItemText primary={obj.name + " " + obj.size} />

              <li>
                {obj.nest.map((nest, idx) => (
                  <li key={idx}>
                    <ListItemText
                      secondary={nest.color + " (" + nest.quantity + " pcs)"}
                    />
                  </li>
                ))}
              </li>
            </List>
          ));
        },
      },
    },
    {
      name: "number",
      label: "Phone Number",
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: "totalAmount",
      label: "Total Amount",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return value;
        },
      },
    },
    {
      name: "downpayment",
      label: "Downpayment",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "credit",
      label: "Outstanding Balance",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },

    {
      name: "stateOrder",
      label: "Regular/Rush",
      options: {
        filter: true,
        sort: true,
      },
    },

    {
      name: "mode",
      label: "Delivery/Pick-Up",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "orderCreatedAt",
      label: "Month",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return new Date(value.seconds * 1000).toLocaleString("en-us", {
            month: "long",
          });
        },
      },
    },
    {
      name: "orderCreatedAt",
      label: "Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return new Date(value.seconds * 1000).toLocaleString("en-us", {
            day: "numeric",
          });
        },
      },
    },
    {
      name: "orderCreatedAt",
      label: "Year",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return new Date(value.seconds * 1000).toLocaleString("en-us", {
            year: "numeric",
          });
        },
      },
    },
    {
      name: "instructions",
      label: "Instructions",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "deliveryDate",
      label: "Delivery Date/Pick-Up Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return new Date(value?.seconds * 1000).toDateString();
        },
      },
    },
    {
      name: "orderStatus",
      label: "Order Status",
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
  ];

  function handleTableChange(action, tableState) {
    // console.log("handleTableChange:... ", tableState.displayData);
    const totalAmount = calculateTotalSum(tableState.displayData);
    setTotal(totalAmount);
  }

  const calculateTotalSum = (data) => {
    const totalAmount = data
      .map((a) => a.data[10])
      .reduce((a, b) => (a += b), 0);
    return totalAmount;
  };

  //---MODA FOR PRINTING---------------------
  const [isOpenPrint, setisOpenPrint] = useState(false);

  const [rowData, setRowData] = useState();

  const handleRowClick = (rowData, rowMeta, e) => {
    setRowData(rowData[0]);
    setisOpenPrint(true);
  };

  const handleClosePrint = () => {
    setisOpenPrint(false);
  };

  //---------------------------------------

  const options = {
    filter: true,
    filterType: "multiselect",
    selectableRows: "none",
    responsive: "standard",
    expandableRows: true,
    download: false,
    jumpToPage: true,
    onRowClick: handleRowClick,
    onTableChange: handleTableChange,
    onTableInit: handleTableChange,
    renderExpandableRow: (rowData, rowMeta) => {
      return (
        <tr>
          <td colSpan={4}>
            <TableContainer>
              <Table style={{ margin: "0 auto" }}>
                <TableHead>
                  <TableCell align="right">Product</TableCell>
                  <TableCell align="right">Color</TableCell>
                  <TableCell align="right">Qty</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Unit Price</TableCell>
                </TableHead>
                <TableBody>
                  {rowData[7].map((row) => {
                    return (
                      <TableRow key={row.id + row.color}>
                        <TableCell component="th" scope="row" align="right">
                          {row.name + " " + row.size}
                        </TableCell>
                        <TableCell align="right">{row.color}</TableCell>
                        <TableCell align="right">{row.quantity}</TableCell>
                        <TableCell align="right">{row.price}</TableCell>
                        <TableCell align="right">
                          {" "}
                          ₱{" "}
                          {Number(row.quantity) *
                            Number(row.price).toLocaleString(
                              navigator.language,
                              {
                                minimumFractionDigits: 2,
                              }
                            )}
                          .00
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </td>
        </tr>
      );
    },
  };

  return (
    <div>
      <BoxDashboards totalAmount={total} />
      <br />
      {loading ? (
        <>
          {" "}
          {/* <Typography variant="subtitle1">
            Total amount : ₱{" "}
            {total.toLocaleString(navigator.language, {
              minimumFractionDigits: 2,
            })}
          </Typography> */}
          <ThemeProvider theme={createTheme()}>
            <MUIDataTable
              title={"List of Orders Reports"}
              columns={columns}
              data={orders}
              options={options}
            />
          </ThemeProvider>
        </>
      ) : (
        <>
          <Loading />
        </>
      )}

      <Dialog open={isOpenPrint} onClose={handleClosePrint}>
        <DialogContent>
          <Print rowData={rowData} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrderReport;
