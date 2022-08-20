import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  doc,
  getDoc,
  updateDoc,
  deleteField,
  collection,
  getDocs,
  addDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../Firebase/utils";

import ButtonForm from "../Button/ButtonForm";
import CardComponent from "../Cards/CardComponent";
import {
  Grid,
  TextField,
  InputAdornment,
  Stack,
  Button,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Radio,
  FormControl,
  Divider,
  InputProps,
} from "@mui/material";
import LoadingProgress from "../Loading/loading";

import AlertComponent from "../Alert/AlertComponent";
import SelectOptions from "../Add Inventory/SelectOptions";

const EditProduct = (props) => {
  const { state } = useLocation(); //document ID here
  const navigate = useNavigate();
  const [product, setProduct] = useState([]);
  const [addColor, setAddColor] = useState(false);
  const [colorList, setColorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState([]);
  const [supplier, setSupplier] = useState("");

  //for the radio button----------------------------------
  const [value, setValue] = useState("stock-in");

  const handleChange = (event) => {
    setValue(event.target.value);
  };
  //------------------------------------------------------

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

  //function to retrieve the selected product details
  const getProduct = async () => {
    const docRef = doc(db, "products", state);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const arr = [];
      arr.push({
        ...docSnap.data(),
      });
      setLoading(true);
      setProduct(arr);
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
    }
  };

  //fetching categories
  const fetchCategory = async () => {
    const querySnapshot = await getDocs(collection(db, "category"));
    const arr = [];
    querySnapshot.forEach((doc) => {
      arr.push({
        ...doc.data(),
        id: doc.id,
      });
    });
    setCategory(arr); // Moved this out of the loop to be run once.
  };

  useEffect(async () => {
    (async () => {
      await getProduct();
      await fetchCategory();
      // await other async operations here.
    })(); // This immediately runs the func async.
  }, []);

  //for the colors
  const handleColorChange = (e, index) => {
    const { name, value } = e.target;
    setColorList((prevState) => {
      const list = [...prevState];
      list[index][name] = name === "colorStocks" ? +value : value;
      return list;
    });
  };

  //removing the colors from the colorList array
  const handleColorRemove = (index) => {
    const list = [...colorList];
    list.splice(index, 1);
    setColorList(list);
  };

  //adding the colors in the colorList array
  const handleColorAdd = () => {
    setAddColor(true);
    setColorList([...colorList, { color: "", colorStocks: "" }]);
  };

  //colorList to colorMap (map)
  const colorMap = colorList.reduce(function (map, obj) {
    map[obj.color] = obj.colorStocks;
    return map;
  }, {});

  //to save this in firestore when editing
  const changeHandler = (index) => (e) => {
    const { name, value } = e.target;
    setProduct((product) =>
      product.map((prod, i) =>
        i === index
          ? {
              ...prod,
              [name]: value,
            }
          : prod
      )
    );
  };

  //for the colorMap
  const onChangeValues = (propertyName, index, value) => {
    let item = product?.[index];
    if (item) {
      item.colorMap[propertyName] = value;
      let prods = [...product];
      prods[index] = item;
      setProduct(prods);
    }
  };

  //not sure with this------------------------------------
  const [size, setSize] = useState();
  const handleOptions = (e) => setSize(e.target.value);
  //-----------------------------------------------------

  //submitting the edited product details in firestore
  const handleSubmit = (index) => async (e) => {
    e.preventDefault();

    const colorSaveArray = Object.keys(colorMap);
    const qtyArray = Object.values(colorMap);
    const ref = doc(db, "products", state);
    await updateDoc(ref, {
      ...product[index],
    });

    for (let index = 0; index < colorSaveArray.length; index++) {
      const colorSave = colorSaveArray[index];
      const qty = qtyArray[index];
      await updateDoc(ref, {
        [`colorMap.${colorSave}`]: qty,
      });
    }

    historyStore(); // saving this in a subcollection "history"
  };

  //deleting the specific color
  const handleDelete = async (color) => {
    const ref = doc(db, "products", state);
    await updateDoc(ref, {
      [`colorMap.${color}`]: deleteField(),
    });
    alert(" Deleted");
    window.location.reload();
  };

  //storing it in the subcollection history
  const historyStore = async () => {
    try {
      const historyRef = await doc(db, "products", state);
      const colRef = collection(historyRef, "history");

      //the colorMap is from the colorList array, this would save the added color in the subcollection
      product.map(({ prodName, price, size, cat, supplier }) => {
        addDoc(colRef, {
          prodName,
          price,
          docID: state,
          colorMap,
          size,
          cat,
          supplier,
          createdDate: new Date(),
          status: colorList.length > 0 ? "Stock-in" : "Modified details", //if there's no entered additional color then it will be saved as modified details else it will be saved as stock-in
        });
      });
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(colorList.length > 0 ? "Modified details" : "empty");

  //individual stock in of the colors
  const handleStockIn = async (color, value) => {
    const stocks = value ? Number(value) : 0;

    try {
      const ref = doc(db, "products", state);
      await updateDoc(ref, {
        [`colorMap.${color}`]: increment(stocks),
      });
      //storing this in a subcollection to keep a record of the stock in
      const historyRef = await doc(db, "products", state);
      const colRef = collection(historyRef, "history");
      product.map(({ prodName, price, size, cat, supplier }) => {
        addDoc(colRef, {
          prodName,
          price,
          colorMap: {
            [`${color}`]: stocks,
          },
          size,
          cat,
          supplier,
          createdDate: new Date(),
          status: "stock-in",
          docID: state,
        });
      });
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  // console.log(value === "stock-in" ? "stock-in" : "modified detail");

  return (
    <div>
      <Stack direction="row" justifyContent="start" style={{ margin: "1rem" }}>
        <Grid item xs={1}>
          <ButtonForm onClick={() => navigate(-1)}>go back</ButtonForm>
        </Grid>{" "}
      </Stack>

      {loading ? (
        <>
          <CardComponent title="Update Product">
            <FormControl>
              <FormLabel id="demo-controlled-radio-buttons-group">
                Edit the product details or just stock in?
              </FormLabel>
              <RadioGroup
                aria-labelledby="demo-controlled-radio-buttons-group"
                name="controlled-radio-buttons-group"
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel
                  value="edit"
                  control={<Radio />}
                  label="Edit Product Details/Add more colors"
                />
                <FormControlLabel
                  value="stock-in"
                  control={<Radio />}
                  label="Stock-In"
                />
              </RadioGroup>
            </FormControl>
            <Divider /> <br />
            {product &&
              product.map((prod, index) => (
                <form onSubmit={handleSubmit(index)}>
                  <Grid container direction={"column"} spacing={2}>
                    <Grid item>
                      <TextField
                        type="text"
                        value={prod.cat}
                        variant="outlined"
                        label="Category"
                        fullWidth
                        disabled
                      />
                    </Grid>

                    <Grid item>
                      <TextField
                        type="text"
                        disabled
                        value={prod.size}
                        variant="outlined"
                        label="Size"
                        name="size"
                        fullWidth
                        // onChange={changeHandler(index)}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        type="text"
                        value={prod.prodName}
                        variant="outlined"
                        label="Product Name"
                        name="prodName" //<---- name attribute similar to the variable saved in db
                        fullWidth
                        onChange={changeHandler(index)}
                        disabled={value === "stock-in" ? true : false}
                      />
                    </Grid>

                    <Grid item>
                      <TextField
                        type="text"
                        name="price"
                        variant="outlined"
                        label="Price"
                        fullWidth
                        disabled={value === "stock-in" ? true : false}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">₱</InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="start">
                              .00
                            </InputAdornment>
                          ),
                        }}
                        value={prod.price}
                        onChange={changeHandler(index)}
                        // value={price}
                        // onChange={(e) => setPrice(e.target.value)}
                      />
                    </Grid>

                    <Grid item>
                      <Grid item>
                        <TextField
                          type="text"
                          value={prod.supplier}
                          variant="outlined"
                          label="Supplier"
                          name="supplier" //<---- name attribute similar to the variable saved in db
                          fullWidth
                          onChange={changeHandler(index)}
                          disabled={value === "stock-in" ? true : false}
                        />
                      </Grid>
                    </Grid>
                    <Grid item>
                      {Object.entries(prod.colorMap).map((color) => (
                        <>
                          <Grid
                            container
                            rowSpacing={1}
                            spacing={{ xs: 2, md: 3 }}
                            columns={{ xs: 4, sm: 8, md: 12 }}
                          >
                            <Grid item xs={2} sm={4} md={4}>
                              <TextField
                                type="text"
                                variant="outlined"
                                label="Color"
                                fullWidth
                                value={color[0]}
                                disabled
                              />
                            </Grid>

                            <Grid item xs={2} sm={4} md={4}>
                              <TextField
                                type="number"
                                defaultValue={color[1]}
                                variant="outlined"
                                fullWidth
                                label="Stocks"
                                value={color[1]}
                                InputProps={{ inputProps: { min: 0 } }}
                                onChange={({ target: { value } }) => {
                                  onChangeValues(
                                    color[0],
                                    index,
                                    // Number(value)
                                    parseInt(value)
                                  );
                                }}
                              />
                            </Grid>
                            <Grid item xs={2} sm={4} md={4}>
                              <Button
                                onClick={() => handleDelete(color[0])}
                                variant="outlined"
                                color="warning"
                                size="small"
                              >
                                Delete color
                              </Button>
                            </Grid>
                            {value === "stock-in" && (
                              <Grid item xs={2} sm={4} md={4}>
                                <Button
                                  onClick={() =>
                                    handleStockIn(color[0], color[1])
                                  }
                                  variant="outlined"
                                  color="success"
                                  size="small"
                                >
                                  Stock-In
                                </Button>
                              </Grid>
                            )}
                          </Grid>{" "}
                          <br />
                        </>
                      ))}
                    </Grid>
                    <Grid item>
                      {colorList.map((singleColor, index) => (
                        <div key={index}>
                          <div style={{ display: "flex" }}>
                            <>
                              {addColor === true && (
                                <>
                                  <Grid
                                    item
                                    xs={6}
                                    style={{ display: "inline-block" }}
                                  >
                                    <TextField
                                      label="Color"
                                      name="color"
                                      type="text"
                                      id="color"
                                      required
                                      value={singleColor.color}
                                      onChange={(e) =>
                                        handleColorChange(e, index)
                                      }
                                    />
                                  </Grid>
                                  <br />
                                  <Grid
                                    item
                                    xs={6}
                                    style={{ display: "inline-block" }}
                                  >
                                    <TextField
                                      label="Stocks"
                                      name="colorStocks"
                                      type="number"
                                      id="colorStocks"
                                      InputProps={{
                                        inputProps: {
                                          min: 0,
                                        },
                                      }}
                                      required
                                      value={singleColor.colorStocks}
                                      onChange={(e) =>
                                        handleColorChange(e, index)
                                      }
                                    />
                                  </Grid>
                                </>
                              )}
                            </>
                          </div>
                          <br />
                          <Grid item xs>
                            {colorList.length >= 1 && (
                              <Button
                                color="secondary"
                                onClick={() => handleColorRemove(index)}
                              >
                                Remove
                              </Button>
                            )}
                          </Grid>
                          <br />
                        </div>
                      ))}

                      {value === "edit" && (
                        <div>
                          {colorList.length >= index && (
                            <Button
                              onClick={handleColorAdd}
                              variant="outlined"
                              color="primary"
                              fullWidth
                            >
                              Add Color
                            </Button>
                          )}

                          <Grid item style={{ marginTop: "1rem" }}>
                            {" "}
                            <ButtonForm type="submit" onClick={handleClick}>
                              Submit
                            </ButtonForm>
                          </Grid>
                        </div>
                      )}
                    </Grid>
                  </Grid>
                </form>
              ))}
          </CardComponent>
        </>
      ) : (
        <>
          <LoadingProgress />
        </>
      )}
      <AlertComponent open={open} handleClose={handleClose} />
    </div>
  );
};

export default EditProduct;
