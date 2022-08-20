import React, { useState, useEffect } from "react";
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  IconButton,
  TablePagination,
  Typography,
  TextField,
  InputAdornment,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const ListItems = ({
  cartItems,
  handleCartClearance,
  handleRemove,
  handleAdd,
  totalAmount,
  discount,
  setDiscount,
  amount,
  rushFee,
  setRushFee,
  stateOrder,
  handleState,
  customizeFee,
  setCustomizeFee,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(cartItems, "order");
  };

  //for the pagination
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  //-------------------------------------------------------

  return (
    <div>
      <Typography variant="subtitle1">List of Orders</Typography>

      <form onSubmit={handleSubmit}>
        {cartItems.length === 0 && <div>No Items in the cart</div>}
        <div style={{ marginTop: "12px" }}>
          <Divider />
          <TableContainer component={Paper}>
            <Table aria-label="simple table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center"></TableCell>
                  <TableCell align="center">Color</TableCell>
                  <TableCell>Qty</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell></TableCell>

                  <TableCell>Unit Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {cartItems
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((item) => (
                    <TableRow key={item.id + item.color}>
                      <TableCell align="center">
                        {item.name + " (" + item.size + ")" + " " + item.cat}
                      </TableCell>
                      <TableCell align="center">{item.color}</TableCell>
                      <TableCell>
                        <input
                          style={{ width: "2rem" }}
                          min="0"
                          required
                          value={item.quantity}
                          onChange={(e) => {
                            if (e.target.value === "0") {
                              return handleRemove(item.quantity + item.color);
                            }
                            const re = /^[0-9\b]+$/;
                            if (
                              e.target.value === "" ||
                              re.test(e.target.value)
                            ) {
                              handleAdd(
                                item.id,
                                item.prodName,
                                item.price,
                                item.size,
                                item.cat,
                                item.color,
                                item.supplier,
                                e.target.value
                              );
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        ₱{" "}
                        {Number(item.price).toLocaleString(navigator.language, {
                          minimumFractionDigits: 2,
                        })}
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          onClick={(e) =>
                            handleAdd(
                              item.id,
                              item.prodName,
                              item.price,
                              item.size,
                              item.cat,
                              item.color,
                              item.supplier
                            )
                          }
                        >
                          <AddIcon color="success" />
                        </IconButton>

                        <IconButton onClick={(e) => handleRemove(item)}>
                          <RemoveIcon />
                        </IconButton>
                      </TableCell>
                      <TableCell>
                        ₱{" "}
                        {Number(item.quantity) *
                          Number(item.price).toLocaleString(
                            navigator.language,
                            {
                              minimumFractionDigits: 2,
                            }
                          )}
                        .00
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            labelRowsPerPage={"Product per page"}
            component="div"
            count={cartItems.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Divider />
          <div>
            <Typography>
              Amount: ₱{" "}
              {amount.toLocaleString(navigator.language, {
                minimumFractionDigits: 2,
              })}
            </Typography>
            <br />
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Regular or Rush
              </FormLabel>
              <RadioGroup
                row
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={stateOrder}
                onChange={handleState}
              >
                <FormControlLabel
                  value="Regular"
                  control={<Radio />}
                  label="Regular"
                />
                <FormControlLabel
                  value="Rush"
                  control={<Radio />}
                  label="Rush"
                />
              </RadioGroup>
            </FormControl>
            {stateOrder === "Rush" && (
              <TextField
                label="Rush Fee"
                type="number"
                value={rushFee}
                onChange={(e) => {
                  if (Number(e.target.value) < 0) {
                    setRushFee(0);
                  } else {
                    setRushFee(parseInt(e.target.value));
                  }
                }}
                // onChange={(e) => setRushFee(parseInt(e.target.value))}
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
            )}
            <br /> <br />
            <TextField
              type="number"
              label="Customization Fee"
              value={customizeFee}
              onChange={(e) => {
                if (Number(e.target.value) < 0) {
                  setCustomizeFee(0);
                } else {
                  setCustomizeFee(parseInt(e.target.value));
                }
              }}
              // onChange={(e) => parseInt(setCustomizeFee(e.target.value))}
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
            <br /> <br />
            <br /> <br />
            <TextField
              type="number"
              label="Discount"
              value={discount}
              onChange={(e) => {
                if (Number(e.target.value) < 0) {
                  setDiscount(0);
                } else {
                  setDiscount(parseInt(e.target.value));
                }
              }}
              // onChange={(e) => setDiscount(parseInt(e.target.value))}
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
            <br />
            <br />
            <Typography variant="h6">
              Total amount: ₱{" "}
              {totalAmount.toLocaleString(navigator.language, {
                minimumFractionDigits: 2,
              })}
            </Typography>
          </div>

          <div style={{ marginTop: "12px" }}>
            {cartItems.length >= 1 && (
              <Button onClick={handleCartClearance} variant="outlined">
                Clear Orders
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default ListItems;
