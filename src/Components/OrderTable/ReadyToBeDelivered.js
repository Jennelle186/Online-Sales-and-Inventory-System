import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  List,
  ListItemText,
  Typography,
  TableFooter,
  ThemeProvider,
  createTheme,
  Button,
  Dialog,
  DialogContent,
} from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";

import { db } from "../../Firebase/utils";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  onSnapshot,
  increment,
  setDoc,
} from "firebase/firestore";

import Loading from "../Loading/loading";
import Print from "./print";

const ReadyToBeDelivered = () => {
  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  //function to retrieve the order status of ready to be delivered, and arranged by ascending order
  useEffect(() => {
    let isMounted = true;

    const retrieve = async () => {
      const q = query(
        collection(db, "orders"),
        where("orderStatus", "==", "Ready to be Delivered"),
        orderBy("orderCreatedAt", "asc")
      );
      await onSnapshot(q, (snapshot) => {
        const arr = [];
        snapshot.forEach((userSnapshot) => {
          arr.push({
            ...userSnapshot.data(),
            id: userSnapshot.id,
          });
        });
        if (isMounted) {
          setOrders(arr);
          setLoading(true);
        }
      });
    };

    retrieve().catch((err) => {
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
        sort: true,
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
        sort: true,
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
      label: "Dowpayment",
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
      label: "Delivery/Pick-Up",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "mode",
      label: "Regular/Rush",
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
      name: "deliveryDate",
      label: "Delivery/Pick-Up Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return new Date(value?.seconds * 1000).toDateString();
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
      name: "Set Order Status",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                updateOrderStatus(tableMeta.rowData[0]);
              }}
            >
              Delivered
            </Button>
          );
        },
      },
    },
  ];

  //update the order status to delivered
  const updateOrderStatus = async (id, e) => {
    try {
      const orderRef = doc(db, "orders", id);

      // Set the "capital" field of the city 'DC'
      await updateDoc(orderRef, {
        orderStatus: "Delivered",
      });

      updateData();
    } catch (err) {
      console.log(err);
    }
  };

  //update the document of the counts for the # of delivered orders
  async function updateData() {
    const docRef = doc(db, "orders", "counts");
    await setDoc(
      docRef,
      {
        [`deliveredOrder`]: increment(1),
      },
      { merge: true }
    );
  }

  //gets all of the total amount of each row
  function handleTableChange(action, tableState) {
    // console.log("handleTableChange:... ", tableState.displayData);
    const totalAmount = calculateTotalSum(tableState.displayData);
    setTotal(totalAmount);
  }

  //calculates the total amount of each row
  const calculateTotalSum = (data) => {
    const totalAmount = data
      .map((a) => a.data[10])
      .reduce((a, b) => (a += b), 0);
    return totalAmount;
  };

  //modal----------------------------------

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
    <div style={{ margin: "12px" }}>
      {loading ? (
        <>
          {" "}
          <Typography variant="subtitle1">
            Total amount : ₱{" "}
            {total.toLocaleString(navigator.language, {
              minimumFractionDigits: 2,
            })}
          </Typography>
          <ThemeProvider theme={createTheme()}>
            <MUIDataTable
              title={"Ready to be Delivered Orders"}
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

export default ReadyToBeDelivered;
