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
  ListItemText,
  Typography,
  ThemeProvider,
  createTheme,
  Dialog,
  DialogContent,
} from "@mui/material";

import { db } from "../../Firebase/utils";
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  writeBatch,
  doc,
} from "firebase/firestore";

import Loading from "../Loading/loading";
import Print from "./print";

//This is the page or component for all of the cancelled orders
const Cancelled = () => {
  const [total, setTotal] = useState(0);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    //function to retrieve all of the cancelled orders and it will be retrieved in descending order
    const getOrders = async () => {
      // const querySnapshot = await getDocs(collection(db, "orders"));
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("orderStatus", "==", "Cancelled"),
        orderBy("orderCreatedAt", "desc")
      );
      const querySnapshot = await getDocs(q);
      const arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      if (isMounted) {
        setOrders(arr); //pushing all of the arr values in the useState setOrders which is an array
        setLoading(true); // while it is mounted or still retrieving all of the values, this will set the loading to true
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

  //these are the column names
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
      label: "Downpayment",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "credit",
      label: "Outstanding balance",
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
      label: "Delivery Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return new Date(value?.seconds * 1000).toDateString();
        },
      },
    },
  ];

  //function to get the total of all the rows
  function handleTableChange(action, tableState) {
    // console.log("handleTableChange:... ", tableState.displayData);
    const totalAmount = calculateTotalSum(tableState.displayData);
    setTotal(totalAmount);
  }

  //function to sum all of the total amount of each rows
  const calculateTotalSum = (data) => {
    const totalAmount = data
      .map((a) => a.data[10])
      .reduce((a, b) => (a += b), 0);
    return totalAmount;
  };

  //---MODA FOR PRINTING---------------------
  const [isOpenPrint, setisOpenPrint] = useState(false);

  const [rowData, setRowData] = useState();

  const handleRowClick = (rowData, rowMeta) => {
    setRowData(rowData[0]);
    setisOpenPrint(true);
  };

  const handleClosePrint = () => {
    setisOpenPrint(false);
  };

  //---------------------------------------
  // const [idsToDelete, setIdsToDelete] = useState([]);
  const options = {
    filter: true,
    filterType: "multiselect",
    selectableRows: "none",
    responsive: "standard",
    expandableRows: true,
    download: false,
    jumpToPage: true,
    selectableRows: "multiple", // to enable the checkbox when deleting the rows
    onRowsDelete: (rowsDeleted) => {
      const idArray = rowsDeleted.data.map((d) => orders[d.dataIndex].id); // array of all ids to to be deleted
      deleteInFirestore(idArray);
    },
    onRowClick: handleRowClick,
    onTableChange: handleTableChange,
    onTableInit: handleTableChange,
    renderExpandableRow: (rowData, rowMeta) => {
      return (
        <tr>
          {/* this is the data for each rows, expandable rows  */}
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

  //deleting data in firebase or deleting the order(s)
  async function deleteInFirestore(idsToDelete) {
    try {
      const batch = writeBatch(db);

      idsToDelete.forEach((id) => {
        batch.delete(doc(db, "orders", id));
      });

      await batch.commit();
      alert("deleted");
      window.location.reload();

      console.log("deleted");
    } catch (err) {
      console.log(err);
    }
  }

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
              title={"Cancelled Orders"}
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

export default Cancelled;
