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
  ThemeProvider,
  createTheme,
  Button,
  IconButton,
  Dialog,
  DialogContent,
} from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

import { db } from "../../Firebase/utils";
import {
  collection,
  query,
  orderBy,
  where,
  doc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

import Loading from "../Loading/loading";
import Modal from "../Modal/Modal";
import Print from "./print";

const PendingOrders = () => {
  const [total, setTotal] = useState(0);
  const [uid, setUid] = useState();
  const [rowData, setRowData] = useState();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  //   useEffect(() => {
  //     let isMounted = true;

  //     const getOrders = async () => {
  //       const ordersRef = collection(db, "orders");
  //       const q = query(ordersRef, where("orderStatus", "==", "Pending"));
  //       const querySnapshot = await getDocs(q);
  //       const arr = [];
  //       querySnapshot.forEach((doc) => {
  //         arr.push({
  //           ...doc.data(),
  //           id: doc.id,
  //         });
  //       });
  //       if (isMounted) {
  //         setOrders(arr);
  //         setLoading(true);
  //       }
  //     };

  //     getOrders().catch((err) => {
  //       if (!isMounted) return;
  //       console.error("failed to fetch data", err);
  //     });

  //     return () => {
  //       isMounted = false;
  //     };
  //   }, []);

  //retrieving all of the order status with an order status of pending in asceding order
  useEffect(() => {
    let isMounted = true;

    const retrieve = async () => {
      const q = query(
        collection(db, "orders"),
        where("orderStatus", "==", "Pending"),
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

  //these are the column headers
  const columns = [
    {
      name: "Print",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <IconButton
              color="primary"
              aria-label="file download"
              onClick={(e) => handleOpenPrint(tableMeta.rowData[1])}
            >
              <FileDownloadIcon />
            </IconButton>
          );
        },
      },
    },
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
          return <div>{tableMeta.rowData[2] + " " + tableMeta.rowData[3]}</div>;
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
        display: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <div>
              {tableMeta.rowData[4]} - {tableMeta.rowData[5]}
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
      name: "Ready to be Delivered",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button onClick={(e) => updateOrderStatus(tableMeta.rowData[1])}>
              Ready to be Delivered
            </Button>
          );
        },
      },
    },
    {
      name: "Cancel",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            <Button
              onClick={(e) => handleOpen(tableMeta.rowData[1])}
              color="error"
              variant="outlined"
            >
              Cancel
            </Button>
          );
        },
      },
    },
  ];

  //update the order status to delivered
  const updateOrderStatus = async (id) => {
    try {
      const orderRef = doc(db, "orders", id);

      // Set the "capital" field of the city 'DC'
      await updateDoc(orderRef, {
        orderStatus: "Ready to be Delivered",
      });

      // updateData();
    } catch (err) {
      console.log(err);
    }
  };

  //-----CANCEL FUNCTIONS------------------

  //modal----------------------------------
  const [isOpen, setisOpen] = useState(false);

  const handleOpen = (id) => {
    setUid(id);
    setisOpen(true);
  };

  const handleClose = () => {
    setisOpen(false);
  };
  //---------------------------------------

  //function to cancel the order
  const cancel = async (id) => {
    try {
      const orderRef = doc(db, "orders", id);

      // Set the order status to cancelled
      await updateDoc(orderRef, {
        orderStatus: "Cancelled",
      });

      // updateData();
    } catch (err) {
      console.log(err);
    }
  };
  //----------------------------------------

  //---MODA FOR PRINTING---------------------
  const [isOpenPrint, setisOpenPrint] = useState(false);

  const handleOpenPrint = (rowData) => {
    setRowData(rowData);
    setisOpenPrint(true);
  };

  const handleClosePrint = () => {
    setisOpenPrint(false);
  };

  //------------------------------------------

  //update the document of the counts for the # of delivered orders
  //not sure with this yet
  // async function updateData() {
  //   const docRef = doc(db, "orders", "counts");
  //   await updateDoc(docRef, {
  //     [`deliveredOrder`]: increment(1),
  //   });
  // }

  //get the total amount of each rows
  function handleTableChange(action, tableState) {
    // console.log("handleTableChange:... ", tableState.displayData);
    const totalAmount = calculateTotalSum(tableState.displayData);
    setTotal(totalAmount);
  }

  //calculate all of the total amount of all the rows
  const calculateTotalSum = (data) => {
    const totalAmount = data
      .map((a) => a.data[11])
      .reduce((a, b) => (a += b), 0);
    return totalAmount;
  };

  const options = {
    filter: true,
    filterType: "multiselect",
    selectableRows: "none",
    responsive: "standard",
    expandableRows: true,
    download: false, //removes the excel download
    jumpToPage: true,
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
                  {rowData[8].map((row) => {
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

  let sample = "Are you sure you want to cancel this order?";

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
              title={"Pending Orders"}
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

      <Modal
        id={uid}
        title="Confirmation"
        subtitle={sample}
        isOpen={isOpen}
        handleClose={handleClose}
        deleteProductCallBack={cancel}
      />

      <Dialog open={isOpenPrint} onClose={handleClosePrint}>
        <DialogContent>
          <Print rowData={rowData} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingOrders;
