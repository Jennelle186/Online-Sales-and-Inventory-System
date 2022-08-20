import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CardComponent from "../Cards/CardComponent";
import {
  TextField,
  Grid,
  InputAdornment,
  IconButton,
  Avatar,
  Typography,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import logo from "../../assets/logo.jpg";
import ButtonForm from "../Button/ButtonForm";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

const Login = (props) => {
  const { children } = props;
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = () => setShowPassword(!showPassword);

  const [isLoading, setIsLoading] = useState(false);

  //Function for submitting the user's email and passwor and check whether it is a valid user or not
  const handleSubmit = async (e) => {
    e.preventDefault();
    const auth = getAuth();
    // console.log(email, password, "1");
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in

        //if user is signed in, redirect to the the dashboard or the homepage
        const user = userCredential.user;
        setIsLoading(false);
        navigate("/Dashboard");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setIsLoading(false);
        alert(errorMessage);
      });
  };

  return (
    <>
      <CardComponent title="Lines Hub Admin User">
        <form onSubmit={handleSubmit}>
          <Grid container direction={"column"} spacing={2}>
            <Grid align="center">
              <Avatar src={logo} sx={{ width: "120px", height: "120px" }} />
            </Grid>
            <Grid item xs>
              <TextField
                type="text"
                id="standard1"
                label="Email"
                fullWidth
                required
                autoComplete="on"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </Grid>

            <Grid item xs>
              <TextField
                id="Password"
                label="Password"
                variant="outlined"
                fullWidth
                required
                type={showPassword ? "text" : "password"} // <-- This is where the magic happens
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  // <-- This is where the toggle button is added.
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <Visibility /> : <VisibilityOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>

            {/* {isLoading && <div>Loading ...</div>} */}

            {isLoading ? (
              <>
                {" "}
                <Grid item xs>
                  <ButtonForm type="submit" disabled>
                    Loading..
                  </ButtonForm>
                </Grid>
              </>
            ) : (
              <>
                <Grid item xs>
                  <ButtonForm type="submit">Submit</ButtonForm>
                </Grid>
              </>
            )}

            {/* <Grid item xs>
              <ButtonForm onClick={googleHandler}>Login with Gmail</ButtonForm>
            </Grid> */}

            <Grid item xs>
              <Link to="/forgot-password">
                <Typography variant="subtitle2" align="center">
                  Forgot Password?
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </form>
      </CardComponent>

      <Link to="/About-Us" style={{ textDecoration: "none" }}>
        <Typography
          variant="subtitle2"
          style={{ color: "#B2BEB5", marginTop: "3rem" }}
        >
          Developed by Lines Hub Group
        </Typography>
      </Link>
    </>
  );
};

export default Login;
