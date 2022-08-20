import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Box,
  Typography,
  Stack,
} from "@mui/material";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { useNavigate } from "react-router-dom";

import { db } from "../../Firebase/utils";
import {
  query,
  where,
  collection,
  getDocs,
  doc,
  getDoc,
  orderBy,
} from "firebase/firestore";
import StocksAlert from "../StocksAlerts/StocksAlert";

const BoxDashboards = ({ totalAmount }) => {
  const navigate = useNavigate();
  const [pending, setPending] = useState();
  const [readyDelivery, setReadyDelivery] = useState();
  const [delivered, setDelivered] = useState();
  const [product, setProduct] = useState([]);

  useEffect(() => {
    let isMounted = true;

    //function to retrieve the orders with the order status of pending
    const getPending = async () => {
      const ordersRef = collection(db, "orders");
      const q = query(ordersRef, where("orderStatus", "==", "Pending"));
      const querySnapshot = await getDocs(q);
      // console.log(querySnapshot.docs.length, "pending orders");

      if (isMounted) {
        setPending(querySnapshot.docs.length);
      }
    };

    //function to retrieve the order with the order status of ready to be delivered
    const getReadyDelivery = async () => {
      const ordersRef = collection(db, "orders");
      const q = query(
        ordersRef,
        where("orderStatus", "==", "Ready to be Delivered")
      );
      const querySnapshot = await getDocs(q);
      // console.log(querySnapshot.docs.length, "pending orders");

      if (isMounted) {
        setReadyDelivery(querySnapshot.docs.length);
      }
    };

    //function to retrieve the order with an order status of delivered
    const getDelivered = async () => {
      const docRef = doc(db, "orders", "counts");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        if (isMounted) {
          setDelivered(docSnap.data().deliveredOrder);
        }
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    };

    //function to retrieve the products
    const getProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      if (isMounted) {
        setProduct(arr);
      }
    };

    getPending().catch((err) => {
      if (!isMounted) return;
      console.error("failed to fetch data", err);
    });

    getReadyDelivery().catch((err) => {
      if (!isMounted) return;
      console.error("failed to fetch data", err);
    });

    getDelivered().catch((err) => {
      if (!isMounted) return;
      console.error("failed to fetch data", err);
    });

    getProducts().catch((err) => {
      if (!isMounted) return;
      console.error("failed to fetch data", err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  //not sure with this yet
  // useEffect(async () => {
  //   const ordersRef = collection(db, "orders");
  //   const q = query(ordersRef, where("orderStatus", "==", "Pending"));
  //   const querySnapshot = await getDocs(q);
  //   console.log(querySnapshot.docs.length, "pending orders");
  //   setPending(querySnapshot.docs.length);
  // }, []);

  //this filter not working
  const newProduct = product.filter((item) => {
    return Object.values(item.colorMap).every((color) => color < 10);
  });

  //use this for filtering the stocks less than 10
  const result = product.reduce((r, o) => {
    const colorMap = Object.entries(o.colorMap).filter(([, val]) => val <= 10);
    if (colorMap.length) {
      r.push({
        colorMap: Object.fromEntries(colorMap),
        prodName: o.prodName,
        cat: o.cat,
        id: o.id,
        size: o.size,
        price: o.price,
      });
    }
    return r;
  }, []);

  return (
    <Container style={{ marginTop: "1rem", marginBottom: "1rem" }}>
      <Box sx={{ "& h1": { m: 0 } }}>
        <Grid
          container
          wrap="nowrap"
          sx={{ flexDirection: { xs: "column", md: "row" } }}
          spacing={2}
          justify="flex-start"
        >
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Link to="/Order/Pending-Orders" style={{ textDecoration: "none" }}>
              <Card
                sx={{
                  ":hover": {
                    boxShadow: 20, // theme.shadows[20]
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <PendingActionsIcon
                      style={{ color: "red" }}
                      fontSize="large"
                    />
                    <Typography variant={"h6"} gutterBottom>
                      {pending} Pending Orders
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Link
              to="/Order/Ready-to-be-delivered"
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  ":hover": {
                    boxShadow: 20, // theme.shadows[20]
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <LocalShippingIcon
                      style={{ color: "#FDDA0D" }}
                      fontSize="large"
                    />
                    <Typography variant={"h6"} gutterBottom>
                      {readyDelivery} Ready for Delivery
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Link
              to="/Order/Delivered-Orders"
              style={{ textDecoration: "none" }}
            >
              <Card
                sx={{
                  ":hover": {
                    boxShadow: 20, // theme.shadows[20]
                  },
                }}
              >
                <CardContent>
                  <Stack direction="row" spacing={2}>
                    <FactCheckIcon
                      fontSize="large"
                      style={{ color: "green" }}
                    />
                    <Typography variant={"h6"} gutterBottom>
                      {delivered} Delivered Orders
                    </Typography>
                  </Stack>
                </CardContent>
              </Card>
            </Link>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                ":hover": {
                  boxShadow: 20, // theme.shadows[20]
                },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2}>
                  <PointOfSaleIcon color="success" fontSize="large" />
                  <Typography variant={"h6"} gutterBottom>
                    Sales ₱{" "}
                    {totalAmount.toLocaleString(navigator.language, {
                      minimumFractionDigits: 2,
                    })}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={3}>
            <Card
              sx={{
                ":hover": {
                  boxShadow: 20, // theme.shadows[20]
                },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={2}>
                  <WarningAmberIcon
                    fontSize="large"
                    style={{ color: "#FF5F1F" }}
                  />
                  <Typography
                    variant={"h6"}
                    gutterBottom
                    onClick={() => navigate("/stocks", { state: result })} //passing the variable result which stores the products
                  >
                    {result.length} products for Restocks
                  </Typography>

                  {/* use a navigate here  */}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default BoxDashboards;
