import React, { useState, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Grid,
  Divider,
  Avatar,
  Stack,
  Button,
  Box,
} from "@mui/material";
import logo from "../../assets/logo.jpg";

import { db } from "../../Firebase/utils";
import { getDoc, doc } from "firebase/firestore";

import "./styles.css";

import jsPDF from "jspdf";

const Print = (rowData) => {
  const [order, setOrder] = useState([]);

  //function to retrieve the specific data of the row
  const getOrder = async () => {
    const docRef = doc(db, "orders", rowData.rowData);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const arr = [];
      arr.push({
        ...docSnap.data(),
      });

      setOrder(arr);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  useEffect(async () => {
    (async () => {
      await getOrder();

      // await other async operations here.
    })(); // This immediately runs the func async.
  }, []);

  return (
    <>
      <div class="button">
        {" "}
        <Button
          type="button"
          onClick={() => window.print()}
          variant="contained"
        >
          PRINT
        </Button>
      </div>

      <div className="App">
        <Grid container justify="center"></Grid>
        <div class="page-header">
          <Box display="flex" justifyContent="center" alignItems="center">
            <Stack direction="row" spacing={2} style={{ margin: "0 auto" }}>
              <Avatar
                alt="logo1"
                src={logo}
                sx={{ height: 50, width: 50, marginBottom: "1rem" }}
              />
              <Typography
                variant="h5"
                style={{ marginTop: ".5rem", color: "#03020b" }}
              >
                Lines Printing Services
              </Typography>
            </Stack>
          </Box>
          <Divider />
          <br />
        </div>

        <div class="page-footer"></div>

        <table>
          <thead>
            <tr>
              <td>
                {/* <!--place holder for the fixed-position header--> */}
                <div class="page-header-space" />
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                {/* <!--*** CONTENT GOES HERE ***--> */}

                <div class="page">
                  {order &&
                    order.map((order, index) => (
                      <div key={index}>
                        {" "}
                        <Grid
                          item
                          xs={12}
                          style={{ float: "left", textAlign: "left" }}
                        >
                          {" "}
                          <Typography variant="subtitle1">
                            Order ID: {rowData.rowData}
                          </Typography>
                          <Typography variant="subtitle1">
                            State: {order.mode}
                          </Typography>
                          <Typography variant="subtitle1">
                            {order.mode} date:{" "}
                            {new Date(
                              order.deliveryDate?.seconds * 1000
                            ).toDateString()}
                          </Typography>
                          <Typography variant="subtitle1">
                            Order: {order.stateOrder} order
                          </Typography>
                          <Typography variant="subtitle1" gutterbottom>
                            {order.instruction === "" ? (
                              <p></p>
                            ) : (
                              <Typography variant="subtitle1">
                                Instructions: {order.instruction}
                              </Typography>
                            )}
                          </Typography>
                          <br />
                          <Typography variant="subtitle1">
                            Deliver to:{" "}
                            {order.firstName + "  " + order.lastName}
                          </Typography>
                          <Typography variant="subtitle1">
                            Phone number: {order.number}
                          </Typography>
                          <Typography variant="subtitle1">
                            House No, Street Address :{" "}
                            {order.houseNo + ", " + order.streetAddress}
                          </Typography>
                          <Typography variant="subtitle1">
                            Barangay : {order.barangay}
                          </Typography>
                          <Typography v variant="subtitle1">
                            Landmark: {order.landMark}
                          </Typography>
                        </Grid>
                        {/* ----------------------------------------------------------------- */}
                        <TableContainer>
                          <Divider />
                          <Typography variant="h6"> Order Details</Typography>
                          <Table aria-label="spanning table" size=" small">
                            <TableHead>
                              <TableRow>
                                <TableCell align="left">Product Name</TableCell>
                                <TableCell align="right">Size</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell align="right">Qty.</TableCell>
                                <TableCell align="right">Price</TableCell>
                                <TableCell align="right">Sum</TableCell>
                              </TableRow>
                            </TableHead>

                            <TableBody>
                              {order.cartItems.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>{item.name} </TableCell>
                                  <TableCell>{item.size}</TableCell>
                                  <TableCell>{item.cat}</TableCell>
                                  <TableCell align="right">
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell align="left">
                                    Php{" "}
                                    {item.price.toLocaleString(
                                      navigator.language,
                                      {
                                        minimumFractionDigits: 2,
                                      }
                                    )}
                                  </TableCell>
                                  <TableCell align="right">
                                    Php {""}
                                    {item.price * item.quantity}.00
                                  </TableCell>
                                </TableRow>
                              ))}

                              <TableRow>
                                <TableCell rowSpan={3} />
                                <TableCell colSpan={4}>Total Amount</TableCell>
                                <TableCell align="right">
                                  Php{" "}
                                  {order.totalAmount.toLocaleString(
                                    navigator.language,
                                    {
                                      minimumFractionDigits: 2,
                                    }
                                  )}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell colSpan={4}>Downpayment</TableCell>
                                <TableCell align="right">
                                  Php{" "}
                                  {order.downpayment?.toLocaleString(
                                    navigator.language,
                                    {
                                      minimumFractionDigits: 2,
                                    }
                                  ) || "0.00"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell colSpan={4}>
                                  Outstanding balance
                                </TableCell>
                                <TableCell align="right">
                                  Php{" "}
                                  {order.credit?.toLocaleString(
                                    navigator.language,
                                    {
                                      minimumFractionDigits: 2,
                                    }
                                  ) || "0.00"}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    ))}
                </div>
              </td>
            </tr>
          </tbody>

          <tfoot>
            <tr>
              <td>
                {/* <!--place holder for the fixed-position footer--> */}
                <div class="page-footer-space" />
                <Typography variant="subtitle2">
                  E Locson Drive, Talon-Talon, Zamboanga City, Zamboanga Del Sur
                  <br />
                  Call us at 0917 676 5010 / 0917 676 5011
                  <br /> linesprintingservices@gmail.com | Lines Hub (Facebook)
                </Typography>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
};

export default Print;
