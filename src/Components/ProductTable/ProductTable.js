import React, { useState, useEffect } from "react";
import MUIDataTable from "mui-datatables";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

//firebase
import { db } from "../../Firebase/utils";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";

import Modal from "../Modal/Modal";
import Loading from "../Loading/loading";

const ProductTable = () => {
  const [product, setProduct] = useState([]);
  const [uid, setUid] = useState();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  //for the modal when to pop up and when to close-------
  const [isOpen, setisOpen] = useState(false);

  const handleOpen = (id) => {
    setUid(id);
    setisOpen(true);
  };

  const handleClose = () => {
    setisOpen(false);
  };
  //------------------------------------------------------

  //retrieving all of the product details from the database
  useEffect(() => {
    let isMounted = true;

    const getProducts = async () => {
      const querySnapshot = await getDocs(collection(db, "products"));
      const arr = [];
      querySnapshot.forEach((doc) => {
        arr.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      if (isMounted) {
        setProduct(arr);
        setLoading(true);
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

  //function to delete the product, it retrieves the id in the row and then delete it
  const deleteProduct = async (id) => {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
  };

  //Displaying the data by columns. The "name" must be a data exactly the same from what was saved in the database
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
      },
    },
    {
      name: "Edit",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            //button to pass ID of the row which cna be access with the index 0 since it is placed at the first column
            <Button
              color="success"
              onClick={
                (e) => {
                  e.stopPropagation();
                  navigate("/edit-products", { state: tableMeta.rowData[0] });
                }

                // console.log(tableMeta.rowData[0])
              }
            >
              Edit
            </Button>
          );
        },
      },
    },
    {
      name: "Delete",
      options: {
        filter: false,
        customBodyRender: (value, tableMeta, updateValue) => {
          return (
            //button to pass the ID of the row to delete it
            <Button
              color="error"
              onClick={
                (e) => {
                  e.stopPropagation();
                  handleOpen(tableMeta.rowData[0]);
                }

                // handleOpen
                // () => {
                //   deleteProduct(tableMeta.rowData[0]);
                // }
                // console.log(tableMeta.rowData[0])
              }
            >
              Delete
            </Button>
          );
        },
      },
    },
  ];

  const options = {
    filter: true,
    selectableRows: "none",
    responsive: "standard",
    download: false,
  };

  let sample = "Are you sure you want to delete this product?";

  return (
    <div>
      <br />
      {loading ? (
        <>
          {" "}
          <MUIDataTable
            title={"List of Products"}
            columns={columns}
            data={product}
            options={options}
          />
        </>
      ) : (
        <>
          <Loading />
        </>
      )}

      <Modal
        id={uid}
        title="Confirmation"
        subtitle={sample}
        isOpen={isOpen}
        handleClose={handleClose}
        deleteProductCallBack={deleteProduct}
      />
    </div>
  );
};

export default ProductTable;
