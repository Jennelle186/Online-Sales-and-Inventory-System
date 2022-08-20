import React from "react";
import { Container, ThemeProvider, createTheme } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import MUIDataTable from "mui-datatables";

const StocksAlert = () => {
  const { state } = useLocation(); //retrieving the products here
  const navigate = useNavigate();

  //Function where upon clicking on a row, this would direct the user to edit the specific product
  //the state here holds the data of the rowData[0] which is the id of the chosen product
  //this then leads the user to edit the chose product
  const handleRowClick = (rowData, rowMeta) => {
    navigate("/edit-products", { state: rowData[0] });
  };

  const options = {
    filter: true,
    selectableRows: "none",
    onRowClick: handleRowClick, //enabling the onRowClick and passing the function of the handleRowClick
    download: false,
    responsive: "standard",
  };

  //these are the columnds, the name here must be similar to the variable name from the database
  const columns = [
    {
      name: "id",
      label: "System ID",
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: "cat",
      label: "Category",
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: "size",
      label: "Size",
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: "prodName",
      label: "Product Name",
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: "colorMap",
      label: "Color & Stocks",
      options: {
        filter: false,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return Object.entries(value).map(([key, value]) => {
            return (
              <p key={key}>
                {key} - {value} pieces
              </p>
            );
          });
        },
      },
    },
  ];

  return (
    <Container>
      <div style={{ marginTop: "1.5rem", margin: "12px" }}>
        <ThemeProvider theme={createTheme()}>
          <MUIDataTable
            title={"Products for Restocks"}
            options={options}
            data={state}
            columns={columns}
          />
        </ThemeProvider>
      </div>
    </Container>
  );
};

export default StocksAlert;
