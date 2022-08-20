import React from "react";

import { Stack, Grid, ThemeProvider, createTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import History from "../../Components/HistoryofProducts/history";
import ButtonForm from "../../Components/Button/ButtonForm";

//page for the history along with the button to go back to the previous page
const HistoryPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Grid style={{ padding: "1rem" }}>
        <Stack direction="row" justifyContent="start">
          <Grid item xs={1}>
            <ButtonForm onClick={() => navigate(-1)}>go back</ButtonForm>
          </Grid>{" "}
        </Stack>
        <ThemeProvider theme={createTheme()}>
          {" "}
          <History />
        </ThemeProvider>
      </Grid>
    </div>
  );
};

export default HistoryPage;
