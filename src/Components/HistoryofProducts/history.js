// DISPLAYS ALL OF THE HISTORY OF THE PRODUCTS WHICH INCLUDES THE STATUS IF STOCK-IN OR STOCK-OUT

import React, { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";

import { ThemeProvider, createTheme, Grid } from "@mui/material";

import { db } from "../../Firebase/utils";
import {
  getDocs,
  collectionGroup,
  query,
  orderBy,
  doc,
  writeBatch,
} from "firebase/firestore";

const History = (props) => {
  const [product, setProduct] = useState([]);

  //fetching the products document
  useEffect(() => {
    let isMounted = true;
    const getProducts = async () => {
      const listProducts = query(
        collectionGroup(db, "history"),
        orderBy("createdDate", "desc")
      );
      const querySnapshot = await getDocs(listProducts);
      const arr = [];
      querySnapshot.forEach((doc) => {
        // console.log(doc.id, " => ", doc.data());
        arr.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      if (isMounted) {
        setProduct(arr);
      }
    };
    getProducts().catch((err) => {
      if (!isMounted) return;
      console.error("failed to fetch data", err);
    });
    return () => {
      isMounted = false;
    };
  }, []);
  //Displaying the data by columns. The "name" must be a data exactly the same from what was saved in the database
  const columns = [
    {
      name: "docID",
      label: "Document ID",
      options: {
        filter: true,
        sort: true,
        display: false,
      },
    },
    {
      name: "id",
      label: "ID",
      options: {
        filter: true,
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
      },
    },
    {
      name: "prodName",
      label: "Product Name",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "size",
      label: "Size",
      options: {
        filter: true,
        sort: true,
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
    {
      name: "price",
      label: "Price",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return "₱" + value + ".00";
        },
      },
    },
    {
      name: "supplier",
      label: "Supplier",
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: "createdDate",
      label: "Month",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return new Date(value.seconds * 1000).toLocaleString("en-us", {
            month: "long",
          });
        },
      },
    },
    {
      name: "createdDate",
      label: "Date",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return new Date(value.seconds * 1000).toLocaleString("en-us", {
            day: "numeric",
          });
        },
      },
    },
    {
      name: "createdDate",
      label: "Year",
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          return new Date(value.seconds * 1000).toLocaleString("en-us", {
            year: "numeric",
          });
        },
      },
    },

    {
      name: "status",
      label: "Status",
      options: {
        filter: true,
        sort: true,
      },
    },
  ];

  const options = {
    filter: true,
    selectableRows: "none",
    download: false,
    filterType: "multiselect",
    responsive: "standard",
    selectableRows: "multiple", // to enable the checkbox when deleting the rows
    onRowsDelete: (rowsDeleted) => {
      //getting the
      const docID = rowsDeleted.data.map((d) => product[d.dataIndex].docID);
      const historyId = rowsDeleted.data.map((d) => product[d.dataIndex].id); // array of all ids to to be deleted

      batchDeleteDocuments(docID, historyId);
    },
  };
  //deleting data in firebase or deleting the history of the products
  async function batchDeleteDocuments(docID, historyId) {
    try {
      console.log(docID, "docs");
      console.log(historyId, "history");

      const batch = writeBatch(db);

      for (let i = 0; i < docID.length; i++) {
        // console.log(docID[i].trim());
        const docRef = doc(
          db,
          "products",
          docID[i].trim(),
          "history",
          historyId[i]
        );
        // console.log(i, "deleting", docRef.path);
        batch.delete(docRef);
      }

      await batch.commit();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div>
      <Grid style={{ padding: "1rem" }}>
        <ThemeProvider theme={createTheme()}>
          <MUIDataTable
            title={"History of the Products"}
            options={options}
            columns={columns}
            data={product}
          />
        </ThemeProvider>
      </Grid>
    </div>
  );
};
export default History;
