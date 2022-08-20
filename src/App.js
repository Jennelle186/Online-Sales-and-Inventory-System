import React, { useEffect } from "react";
import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
//pages
import SignInPage from "./Pages/SignInPage/SignInPage";
import ForgotPasswordPage from "./Pages/ForgotPasswordPage/ForgotPassPage";
import Home from "./Pages/Home/Home";
import AddProductsPage from "./Pages/AddProducts/AddProductsPage";
import ProductsPage from "./Pages/ProductsPage/productsPage";
import OrderPage from "./Pages/OrderPage/OrderPage";
import PageToOrder from "./Pages/PageToOrder/PageToOrder";
import EditProduct from "./Components/EditProduct/EditProduct";
import AddCategory from "./Components/Category/AddCategory";
import CategoryPage from "./Pages/CategoryPage/categoryPage";
import AboutUs from "./Pages/About Us/AboutUs";

import PendingOrders from "./Components/OrderTable/PendingOrders";
import ReadyToBeDelivered from "./Components/OrderTable/ReadyToBeDelivered";
import DeliveredOrders from "./Components/OrderTable/DeliveredOrders";
import Cancelled from "./Components/OrderTable/CancelledOrders";
import ReturnedOrders from "./Components/OrderTable/ReturnedOrders";

import History from "./Components/HistoryofProducts/history";

import StocksAlert from "./Components/StocksAlerts/StocksAlert";

//layout
import MainLayout from "./Components/MainLayout/MainLayout";
import Layout from "./Components/Layout/Layout";

//firebase

import { auth, useAuth } from "./Firebase/utils";
import { onAuthStateChanged } from "firebase/auth";

import PrivateRoute from "./Components/AuthRoute/AuthRoute";

function App() {
  const { currentUser, isLoading } = useAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  // console.log(currentUser?.email);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // console.log(uid);
        // navigate("/Dashboard");
        // ...
      } else {
        // User is signed out
        // ...
        navigate("/");
      }
    });

    return () => {
      unsub();
    };
  }, []);

  return (
    <div>
      <div>
        <Routes>
          {!isLoading ? (
            <>
              {/* these are the routes the user can access when logged in */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <SignInPage />
                  </MainLayout>
                }
              />
              <Route
                path="/Dashboard"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />

              <Route
                path="/Products"
                element={
                  <PrivateRoute>
                    <Layout>
                      <ProductsPage />
                    </Layout>
                  </PrivateRoute>
                }
              >
                <Route
                  path=":history"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <History />
                      </Layout>
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route
                path="/add-products"
                element={
                  <PrivateRoute>
                    <Layout>
                      <AddProductsPage />
                    </Layout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/edit-products"
                element={
                  <PrivateRoute>
                    <Layout>
                      <EditProduct />
                    </Layout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/stocks"
                element={
                  <PrivateRoute>
                    <Layout>
                      <StocksAlert />
                    </Layout>
                  </PrivateRoute>
                }
              />

              <Route
                path="Order"
                element={
                  <PrivateRoute>
                    <Layout>
                      <OrderPage />
                    </Layout>
                  </PrivateRoute>
                }
              >
                {" "}
                <Route
                  path=":Pending-Orders"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <PendingOrders />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path=":Ready-to-be-delivered"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <ReadyToBeDelivered />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path=":Delivered-Orders"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <DeliveredOrders />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path=":Cancelled"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <Cancelled />
                      </Layout>
                    </PrivateRoute>
                  }
                />
                <Route
                  path=":Returned"
                  element={
                    <PrivateRoute>
                      <Layout>
                        <ReturnedOrders />
                      </Layout>
                    </PrivateRoute>
                  }
                />
              </Route>

              <Route
                path="/add-orders"
                element={
                  <PrivateRoute>
                    <Layout>
                      <PageToOrder />
                    </Layout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/category"
                element={
                  <PrivateRoute>
                    <Layout>
                      <CategoryPage />
                    </Layout>
                  </PrivateRoute>
                }
              />

              <Route
                path="/add-category"
                element={
                  <PrivateRoute>
                    <Layout>
                      <AddCategory />
                    </Layout>
                  </PrivateRoute>
                }
              />
            </>
          ) : (
            <>
              {/* If the user is not logged in, these are the pages they can access. */}
              <Route
                path="/"
                element={
                  <MainLayout>
                    <SignInPage />
                  </MainLayout>
                }
              />
            </>
          )}

          <Route
            path="/forgot-password"
            element={
              <MainLayout>
                <ForgotPasswordPage />
              </MainLayout>
            }
          />

          <Route
            path="/About-Us"
            element={
              <MainLayout>
                <AboutUs />
              </MainLayout>
            }
          />
          {/* <Route path="*" element={<CircularProgress />} /> */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
