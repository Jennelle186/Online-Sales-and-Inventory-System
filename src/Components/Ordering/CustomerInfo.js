import React, { useState } from "react";
import {
  TextField,
  Container,
  Stack,
  Grid,
  Typography,
  Divider,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  InputAdornment,
} from "@mui/material";
import ButtonForm from "../Button/ButtonForm";
import AlertComponent from "../Alert/AlertComponent";

//firebase
import {
  collection,
  addDoc,
  updateDoc,
  increment,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import DesktopDatePicker from "@mui/lab/DesktopDatePicker";
import { db } from "../../Firebase/utils";

const CustomerInfo = ({
  cartItems,
  totalAmount,
  handleCartClearance,
  stateOrder,
  downpayment,
  setDownpayment,
  amount,
  setRushFee,
  setDiscount,
  setCustomizeFee,
}) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [houseNo, setHouseNo] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [barangay, setBarangay] = useState("");
  const [landMark, setLandMark] = useState("");
  const [number, setNumber] = useState("");
  const [instructions, setInstructions] = useState("");

  // delivery date---------------------------------------------
  const [deliveryDate, setDeliveryDate] = useState(new Date());
  const handleChange = (newValue) => {
    setDeliveryDate(newValue);
  };
  //-----------------------------------------------------------

  //for the pick-up or delivery--------------------------------
  const [mode, setMode] = useState("Delivery");
  const handleMode = (event) => {
    setMode(event.target.value);
  };
  //-----------------------------------------------------------

  //for the alert------
  const [open, setOpen] = useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  //------------------------

  const handleNumber = (evt) => {
    const num = evt.target.validity.valid ? evt.target.value : number;

    setNumber(num);
  };

  // async function updateData() {
  //   let color = "Black";
  //   const docRef = doc(db, "products", "ubwRjfrSpDtvZIM6sZHD");
  //   await updateDoc(docRef, {
  //     [`colorMap.${color}`]: increment(-1 * qty),
  //   });
  // }

  //The function where it loops through all of the items that were placed in the cart items.
  //It retrieve the id of the product and it's quantity which would then be used and will be looped over
  //to decrement this in the database
  //increment is used here as it is a built-in function of firebase with the -1 as this signify that this is supposed to
  //subtract the quantity of the item that was placed.
  async function updateData() {
    for (const item of cartItems) {
      const docRef = doc(db, "products", item.id);
      await updateDoc(docRef, {
        [`colorMap.${item.color}`]: increment(-1 * item.quantity),
      });
    }
    console.log("done inventory");
  }

  // adding the user info in the user db
  async function addUser() {
    try {
      const q = query(
        collection(db, "users"),
        where("firstName", "==", firstName),
        where("lastName", "==", lastName)
      );
      const querySnap = await getDocs(q);

      if (querySnap.empty) {
        console.log("No matching document, name available");
        const docRef = await addDoc(collection(db, "users"), {
          firstName,
          lastName,
          houseNo,
          streetAddress,
          barangay,
          landMark,
          number,
        });
      } else {
        console.log(
          "Name found",
          querySnap.docs.map((d) => d.data())
        );
      }
    } catch (err) {
      console.log("cannot add user");
    }
  }

  //after submission, this function is used to clear up all of the fields..
  const clearInfo = () => {
    setFirstName("");
    setLastName("");
    setHouseNo("");
    setStreetAddress("");
    setBarangay("");
    setLandMark("");
    setInstructions("");
    setNumber("");
    setDeliveryDate();
    setDownpayment("");
    setRushFee("");
    setCustomizeFee("");
    setDiscount("");
  };

  //stock-out and saving it in the subcollection

  async function recordStockOut() {
    //saving each of the items in a different document
    for (const item of cartItems) {
      // console.log(item);
      const historyRef = await doc(db, "products", item.id);
      const colRef = collection(historyRef, "history");
      await addDoc(colRef, {
        supplier: item.supplier,
        docID: item.id,
        cat: item.cat,
        status: "stock-out",
        createdDate: new Date(),
        price: item.price,
        prodName: item.name,
        size: item.size,
        colorMap: {
          [`${item.color}`]: item.quantity,
        },
      });
    }
  }

  //submitting the order and customer details in the database orders
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const docRef = await addDoc(collection(db, "orders"), {
        cartItems,
        totalAmount,
        firstName,
        lastName,
        houseNo,
        streetAddress,
        barangay,
        landMark,
        number,
        instructions,
        orderCreatedAt: new Date(),
        orderStatus: "Pending",
        stateOrder,
        deliveryDate,
        mode,
        downpayment,
        credit,
      });
      // addUser(); //function add user
      updateData(); //calls the function to subtract the products in the inventory
      recordStockOut(); // calls the function record the stock-out in the history of the products
      clearInfo(); // calls the function to clear up the search field
      handleCartClearance(); // calls the function to clear up the cart items or the item that were placed.
      setOpen(true); //states as a true to call the alert function that the order was submitted.

      // console.log("Document written with ID: ", docRef.id);
    } catch (err) {
      console.log(err);
    }
  };

  //----------------------------------------

  let credit = Number(totalAmount) - (downpayment ? Number(downpayment) : 0);

  return (
    <Container style={{ padding: "12px" }}>
      <form onSubmit={handleSubmit}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 1, sm: 2, md: 4 }}
        >
          {/* <button onClick={() => recordStockOut()}>Try</button> */}
          <Grid item xs>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Customer Details</Typography>
                <Divider />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  label="First Name"
                  fullWidth
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  label="Last Name"
                  fullWidth
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="number"
                  pattern="[0-9]*"
                  variant="outlined"
                  label="Phone Number"
                  fullWidth
                  value={number} //putting this would not allow the user to delete the first digit
                  onChange={handleNumber}
                  required
                  inputProps={{
                    maxLength: 11,
                  }}
                  InputProps={{
                    disableunderline: "true", // *** Changed case and value per error from React
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Order Details</Typography>
                <Divider />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="text"
                  label="Additional Instructions"
                  fullWidth
                  multiline
                  maxRows={Infinity}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl>
                  <FormLabel id="Pick-up-or-delivery">
                    Pick up or Delivery
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="Pick-up-or-delivery"
                    name="Pick-up-or-delivery"
                    value={mode}
                    onChange={handleMode}
                  >
                    <FormControlLabel
                      value="Delivery"
                      control={<Radio />}
                      label="Delivery"
                    />
                    <FormControlLabel
                      value="Pick-up"
                      control={<Radio />}
                      label="Pick-Up"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    disablePast
                    label={`${mode} date`}
                    inputFormat="MM/dd/yyyy"
                    value={deliveryDate}
                    onChange={handleChange}
                    renderInput={(params) => (
                      <TextField {...params} fullWidth />
                    )}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography>Address Details</Typography>
                <Divider />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  variant="outlined"
                  label="House No"
                  fullWidth
                  required
                  value={houseNo}
                  onChange={(e) => setHouseNo(e.target.value)}
                />
              </Grid>
              <Grid item xs={8}>
                <TextField
                  variant="outlined"
                  label="Street Address"
                  fullWidth
                  required
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  label="Barangay"
                  fullWidth
                  value={barangay}
                  onChange={(e) => setBarangay(e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  variant="outlined"
                  label="Landmark"
                  fullWidth
                  required
                  value={landMark}
                  onChange={(e) => setLandMark(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Payment</Typography>
                <Divider />
              </Grid>

              <Grid item xs={12}>
                <Typography variant="h6">
                  Total amount: ₱{" "}
                  {totalAmount.toLocaleString(navigator.language, {
                    minimumFractionDigits: 2,
                  })}
                </Typography>
              </Grid>

              {totalAmount >= 5000 && (
                <>
                  <Grid item xs={12}>
                    <Typography>
                      You need to input a downpayment as the ordered items have
                      already reached more than ₱5,000.00
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      type="number"
                      label="Downpayment"
                      value={downpayment}
                      step="0.1"
                      required
                      onChange={(e) => {
                        if (Number(e.target.value) < 0) {
                          setDownpayment(0);
                        } else {
                          setDownpayment(parseInt(e.target.value));
                        }
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start"> ₱</InputAdornment>
                        ),
                        inputProps: {
                          min: 0,
                        },
                        endAdornment: (
                          <InputAdornment position="start">.00</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle1">
                      Credit: ₱{" "}
                      {credit.toLocaleString(navigator.language, {
                        minimumFractionDigits: 2,
                      })}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Grid>
        </Stack>
        <Grid item xs={2} style={{ margin: "0 auto", marginTop: "12px" }}>
          {" "}
          {cartItems.length > 0 && (
            <ButtonForm type="submit">Submit Orders</ButtonForm>
          )}
        </Grid>
      </form>
      <AlertComponent open={open} handleClose={handleClose} />
    </Container>
  );
};

export default CustomerInfo;
