import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import "./index.css";
import { useFetchCartQuery } from "./redux/slices/cartApiSlice";
import { updateCart } from "./redux/slices/cartSlice";
import { useGetProductsQuery } from "./redux/slices/productApiSlice";

const App = () => {
  const location = useLocation();
  const {
    data: products,
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductsQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;

  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useFetchCartQuery(userId, {
    skip: !userId,
  });

  const dispatch = useDispatch();

  useEffect(() => {
    if (cartData) {
      dispatch(updateCart(cartData.cart.items));
    }
  }, [cartData, dispatch]);

  const hiddenPaths = [
    "/login",
    "/register",
    "/shop-create",
    "/shop-login",
    "/dashboard",
    "/dashboard/*", // Optionally match nested paths
    "/admin-dashboard",
    "/admin-dashboard/*",
  ];

  const shouldShowHeader = !hiddenPaths.some((path) =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <ToastContainer />
      {shouldShowHeader && (
        <Header
          allProducts={products}
          isLoading={productsLoading}
          error={productsError}
        />
      )}
      {(productsLoading || cartLoading) && <div>Loading...</div>}
      {cartError && toast.error(cartError.message)}
      {productsError && toast.error(productsError.message)}
      <Outlet />
      {shouldShowHeader && <Footer />}
    </>
  );
};

export default App;
