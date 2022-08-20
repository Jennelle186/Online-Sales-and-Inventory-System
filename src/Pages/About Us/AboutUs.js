//This is the About Us Page

import React from "react";
import { Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardMedia,
  Typography,
  CardContent,
  Container,
} from "@mui/material";

const AboutUs = () => {
  const styledCard = {
    zIndex: "10",
    position: "relative",
  };

  const fontStyle = {
    color: "white",
    fontFamily: "Brush Script MT",
  };

  return (
    <>
      <Container>
        {" "}
        <Grid item xs={12}>
          <Typography variant="h2" style={fontStyle}>
            About Us
          </Typography>
        </Grid>
        <Grid item xs={6} style={{ color: "white", margin: "0 auto " }}>
          <Typography variant="body2" gutterBottom>
            Lines Hub Online Sales and Inventory System
          </Typography>
        </Grid>
      </Container>

      <Grid
        container
        spacing={5}
        justifyContent="center"
        justify="flex-start"
        style={{ padding: "1.5rem" }}
      >
        <Grid item xs={12} sm={6} md={4} lg={4} align="center">
          <Card sx={{ maxWidth: 250 }} style={styledCard}>
            <CardMedia
              component="img"
              image="https://drive.google.com/uc?id=1q-yfB7Kp4XYLnyqKibhopxyqUE4Na6LZ"
              alt="Ceed Jennelle B. Lorenzo"
            />
            <CardContent>
              {" "}
              <Typography variant="subtitle1" color="text.primary">
                Ceed Jennelle B. Lorenzo
              </Typography>
              <Typography paragraph variant="body2" color="text.secondary">
                Lead Developer
              </Typography>
              <Typography paragraph>
                I am the Lead Developer for this OJT Project and served as the
                leader of the group at the same time. I oversee the entire
                project including the development and documentation. My skills
                include ReactJS, Firebase, HTML, CSS, Adobe XD, Figma and more.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} align="center">
          <Card sx={{ maxWidth: 250 }} style={styledCard}>
            <CardMedia
              component="img"
              image="https://drive.google.com/uc?id=1F4Z8U0ET246IEZ4UE5Th_a3cfVGijTNy"
              alt="Joana Mae S. Francisco"
            />
            <CardContent>
              {" "}
              <Typography variant="subtitle1" color="text.primary">
                Joana Mae S. Francisco
              </Typography>
              <Typography paragraph variant="body2" color="text.secondary">
                Documentation and Tester
              </Typography>
              <Typography paragraph>
                I'm a student volunteer and a sport enthusiast. I love reading
                books and binge watching on Netflix. I'm good in finance and
                budgeting and have basic knowledge on php, html and bootstrap.
                The documentation and some snippet of code is my contribution to
                this project.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4} lg={4} align="center">
          <Card sx={{ maxWidth: 250 }} style={styledCard}>
            <CardMedia
              component="img"
              image="https://drive.google.com/uc?id=1LTx4tAO5W7OXvtDlXGidWJvGCAVLP4xX"
              alt="Ceed Jennelle B. Lorenzo"
            />

            <CardContent>
              {" "}
              <Typography variant="subtitle1" color="text.primary">
                Imran Al-Rashid S. Nur
              </Typography>
              <Typography paragraph variant="body2" color="text.secondary">
                Documentation and Tester
              </Typography>
              <Typography paragraph>
                I have a basic knowledge of HTML, CSS and some common known
                programming languages and has an ambition to be an IT
                professional. I contributed in this on-the-job-training project
                by working on some snippet of codes and helped tested the system
                for errors.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid
        item
        xs={6}
        style={{ color: "white", margin: "0 auto ", marginBottom: ".5rem" }}
      >
        <Typography variant="body2" gutterBottom>
          This system was developed by students of Western Mindanao State
          University from the department of College of Computing Studies
        </Typography>
      </Grid>

      <Link to="/" style={{ textDecoration: "none", marginBottom: "1rem" }}>
        <Typography variant="body2" style={{ color: "white" }} gutterBottom>
          Back to Home
        </Typography>
      </Link>
    </>
  );
};

export default AboutUs;
