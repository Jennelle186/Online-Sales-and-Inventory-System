import React, { useState } from "react";
import {
  TextField,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Typography,
  Button,
} from "@mui/material";
import CardComponent from "../Cards/CardComponent";
import ButtonForm from "../Button/ButtonForm";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import AlertComponent from "../Alert/AlertComponent";

//firebase
import { db } from "../../Firebase/utils";
import { addDoc, collection } from "firebase/firestore";

const AddCategory = () => {
  const navigate = useNavigate();
  const [cat, setCat] = useState();
  const [value, setValue] = useState("no");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

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

  //function to add more colors----------------------
  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      test: [{ option: "" }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  });
  //---------------------------------------------------

  //function to add the category in the database
  const onSubmit = async (data) => {
    let result = data.test.map((a) => a.option);
    const docRef = await addDoc(collection(db, "category"), {
      cat: cat,
      value,
      options: result,
    });
    setOpen(true); //setting this true will open the alert
    // console.log("Document written with ID: ", docRef.id);
  };

  return (
    <div>
      <Grid item xs={1} style={{ margin: "12px" }}>
        <ButtonForm onClick={() => navigate(-1)}>go back</ButtonForm>
      </Grid>
      <CardComponent title="Add Category">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container direction={"column"} spacing={2}>
            <Grid item xs>
              <TextField
                variant="outlined"
                label="Enter Category"
                name="cat"
                type="text"
                id="cat"
                fullWidth
                value={cat}
                onChange={(e) => setCat(e.target.value)}
                required
              />
            </Grid>
            <Grid item xs>
              <FormControl>
                <FormLabel id="demo-controlled-radio-buttons-group">
                  Does this category have drop down options?
                </FormLabel>
                <RadioGroup
                  aria-labelledby="demo-controlled-radio-buttons-group"
                  name="controlled-radio-buttons-group"
                  value={value}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="yes"
                    control={<Radio />}
                    label="Yes"
                  />
                  <FormControlLabel value="no" control={<Radio />} label="No" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs>
              {value === "yes" ? (
                <>
                  <Grid item xs>
                    <ul>
                      {fields.map((item, index) => {
                        return (
                          <li key={item.id} style={{ listStyleType: "none" }}>
                            <TextField {...register(`test.${index}.option`)} />

                            <Button type="button" onClick={() => remove(index)}>
                              Clear
                            </Button>
                          </li>
                        );
                      })}
                    </ul>
                  </Grid>
                  <section>
                    <Button
                      type="button"
                      onClick={() => {
                        append({ option: "" });
                      }}
                    >
                      add more options
                    </Button>
                  </section>
                </>
              ) : (
                <>
                  <Typography>Please click Submit</Typography>
                </>
              )}
            </Grid>
          </Grid>
          <br />
          <Grid xs>
            <ButtonForm type="submit">Submit</ButtonForm>
          </Grid>
        </form>
      </CardComponent>
      <AlertComponent open={open} handleClose={handleClose} />
    </div>
  );
};

export default AddCategory;
