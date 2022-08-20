import React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { CardHeader } from "@mui/material";

//This is the design for the background for all of the forms
const StyledCard = styled((props) => <Card {...props} />)(({ theme }) => ({
  maxWidth: 500,
  margin: "0 auto",
  marginBottom: "1rem",
  marginTop: "1rem",
  backgroundColor: "#fff", // You're going to have to define this
  zIndex: "10",
  position: "relative",
}));

const CardComponent = (props) => {
  const { title, content } = props;

  return (
    <StyledCard sx={{ minWidth: 275 }} elevation={5}>
      <CardHeader title={title} />
      <CardContent>{props.children}</CardContent>
    </StyledCard>
  );
};

export default CardComponent;
