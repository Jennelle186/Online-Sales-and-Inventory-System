import React from "react";
import { Navigate } from "react-router-dom";

import { useAuth } from "../../Firebase/utils";
import { CircularProgress } from "@mui/material";

//This restricts the pages from non-logged in user
const PrivateRoute = ({ children }) => {
  const { currentUser, isLoading } = useAuth();

  //if it is still loading, this will show a loading spinner
  if (isLoading) {
    return <CircularProgress />; // or loading spinner, etc...
  }

  //if it is not a current user or the user is not logged in it will navigate to the login page
  // the dash sign is equivalent to the login page here
  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
