import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CardComponent from "../Cards/CardComponent";
import {
  Grid,
  TextField,
  Divider,
  Button,
  Typography,
  InputAdornment,
} from "@mui/material";
import ButtonForm from "../Button/ButtonForm";

import AlertComponent from "../Alert/AlertComponent";
import SelectCategory from "./SelectCategory";
import SelectOptions from "./SelectOptions";
//firebase
import { db } from "../../Firebase/utils";
import { addDoc, collection, getDocs, doc, getDoc } from "firebase/firestore";

const AddProducts = () => {
  const navigate = useNavigate();
  const [productName, setProductName] = useState();
  const [category, setCategory] = useState([]);
  const [size, setSize] = useState();
  const [price, setPrice] = useState();
  const [supplier, setSupplier] = useState("");
  const [colorList, setColorList] = useState([{ color: "", colorStocks: "" }]);

  //fetching the categories from the database called "cateogry"
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
      await fetchCategory();
      // await other async operations here.
    })(); // This immediately runs the func async.
  }, []);

  //setting the category
  const handleCategory = (e) => setCat(e.target.value);
  const handleOptions = (e) => setSize(e.target.value);

  //----------
  //----
  const [color, setColor] = useState("");

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

  const [cat, setCat] = useState(); //select
  const [size1, setSize1] = useState(); //select

  //select for the category
  const handleChange = (event) => {
    setCat(event.target.value);
  };

  //for adding more input field for colors and its corresponding stocks
  const handleColorChange = (e, index) => {
    const { name, value } = e.target;
    setColorList((prevState) => {
      const list = [...prevState];
      list[index][name] = name === "colorStocks" ? +value : value;
      return list;
    });
  };

  //function to remove colors and its correspondng stocks from the colorList array
  const handleColorRemove = (index) => {
    const list = [...colorList];
    list.splice(index, 1);
    setColorList(list);
  };

  //function to add the color and adding it in the colorList array
  const handleColorAdd = () => {
    setColorList([...colorList, { color: "", colorStocks: "" }]);
  };

  //function to reduce the color to be saved in the database as a Map
  const colorMap = colorList.reduce(function (map, obj) {
    map[obj.color] = obj.colorStocks;
    return map;
  }, {});

  function handleSelectionUpdate(data) {
    //Whatever you want to do with the data passed
    setSize(data);
  }

  //function to submit the entered products
  const handleSubmit = async (e) => {
    e.preventDefault();

    //this is to save the entered product details in the database called "products"
    const docRef = await addDoc(collection(db, "products"), {
      prodName: productName,
      price: Number(price),
      size: size,
      cat: cat,
      supplier,
      colorMap,
      // color: color,
    });

    //this is to store the entered product details in the subcollection called "history". Additional data includes the data when it was added
    const historyRef = await doc(db, "products", docRef.id);
    const colRef = collection(historyRef, "history");
    addDoc(colRef, {
      docID: docRef.id,
      status: "stock-in",
      prodName: productName,
      price: Number(price),
      size: size,
      cat: cat,
      colorMap,
      supplier,
      createdDate: new Date(),
    });

    setOpen(true);
    // console.log("Document written with ID: ", docRef.id);
  };

  return (
    <div>
      <Grid item xs={1} style={{ margin: "12px" }}>
        <ButtonForm onClick={() => navigate(-1)}>go back</ButtonForm>
      </Grid>

      <CardComponent title="Add Product">
        <form onSubmit={handleSubmit}>
          <Grid container direction={"column"} spacing={2}>
            <Grid item xs>
              <TextField
                label="Product Name"
                name="name"
                type="text"
                id="productName"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                required
                fullWidth
              />
            </Grid>

            <Grid item>
              <SelectCategory
                value={cat}
                onChange={handleCategory}
                category={category}
                required
              />
            </Grid>

            <Grid item xs>
              {category &&
                category.map((index) => (
                  <>
                    {cat === index.cat && index.value === "yes" && (
                      <>
                        <SelectOptions
                          options={index.options}
                          value={size}
                          onChange={handleOptions}
                        />
                      </>
                    )}
                  </>
                ))}
            </Grid>

            <Grid item xs>
              {category &&
                category.map((index) => (
                  <>
                    {cat === index.cat && index.value === "no" && (
                      <>
                        {" "}
                        <TextField
                          label="Size"
                          name="size"
                          type="text"
                          id="size"
                          value={size}
                          onChange={(e) => setSize(e.target.value)}
                          required
                          fullWidth
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                {cat}
                              </InputAdornment>
                            ),
                          }}
                        />
                      </>
                    )}
                  </>
                ))}
            </Grid>
          </Grid>
          <br />
          <Grid item xs>
            <TextField
              label="Price"
              name="price"
              type="text"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              fullWidth
            />
          </Grid>
          <br />
          <Grid item xs>
            <TextField
              label="Supplier"
              name="supplier"
              type="text"
              id="supploer"
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              required
              fullWidth
            />
          </Grid>

          <Typography variant="h6">Colors</Typography>
          {colorList.map((singleColor, index) => (
            <div key={index}>
              <div style={{ display: "flex" }}>
                <Grid item xs={6} style={{ display: "inline-block" }}>
                  <TextField
                    label="color"
                    name="color"
                    type="text"
                    id="color"
                    required
                    value={singleColor.color}
                    onChange={(e) => handleColorChange(e, index)}
                  />
                </Grid>
                <br />
                <Grid item xs={6} style={{ display: "inline-block" }}>
                  <TextField
                    label="Stocks"
                    name="colorStocks"
                    type="number"
                    id="colorStocks"
                    required
                    value={singleColor.colorStocks}
                    onChange={(e) => handleColorChange(e, index)}
                  />
                </Grid>
              </div>
              <br />
              <Grid item xs>
                {colorList.length !== 1 && (
                  <Button
                    color="secondary"
                    onClick={() => handleColorRemove(index)}
                  >
                    Remove
                  </Button>
                )}
              </Grid>
              <br />
              {colorList.length - 1 === index && (
                <ButtonForm onClick={handleColorAdd}>Add Color</ButtonForm>
              )}
            </div>
          ))}
          {/* <Grid item xs>
            <TextField
              label="Color"
              name="color"
              type="text"
              id="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
              fullWidth
            />
          </Grid> */}

          <br />
          <Divider />

          <br />
          <Grid item xs>
            <ButtonForm type="submit">Submit</ButtonForm>
          </Grid>
        </form>
      </CardComponent>
      <AlertComponent open={open} handleClose={handleClose} />
    </div>
  );
};

export default AddProducts;
