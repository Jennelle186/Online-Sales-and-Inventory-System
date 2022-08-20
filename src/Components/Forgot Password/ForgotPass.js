import React, { useState } from "react";
import CardComponent from "../Cards/CardComponent";
import { TextField, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import ButtonForm from "../Button/ButtonForm";

//firebase
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

const ForgotPassword = () => {
  const [email, setEmail] = useState();

  //submitting thee password on the amil
  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    sendPasswordResetEmail(auth, email)
      .then(() => {
        // Password reset email sent!
        // ..
        console.log("email sent");
        alert("Email sent");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..

        alert(errorMessage);
      });
  };
  return (
    <CardComponent title="Forgot Password">
      <form style={{ margin: "0 auto" }} onSubmit={handleSubmit}>
        <Grid container direction={"column"} spacing={2}>
          <Grid item xs>
            <Typography variant="subtitle1">
              Please check your email for the reset password link
            </Typography>
          </Grid>
          <Grid item xs>
            <TextField
              type="text"
              id="standard1"
              label="Email"
              fullWidth
              required
              autoComplete
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>

          <Grid item xs>
            <ButtonForm type="submit">Submit</ButtonForm>
          </Grid>

          <Grid item xs>
            <Link to="/">
              <Typography variant="subtitle2" align="center">
                Back to Login
              </Typography>
            </Link>
          </Grid>
        </Grid>
      </form>
    </CardComponent>
  );
};

export default ForgotPassword;
