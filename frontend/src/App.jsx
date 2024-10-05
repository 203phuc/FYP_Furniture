import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/layout/Header.jsx";
import "./app.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import { useGetProductsQuery } from "./Redux/slices/productApiSlice.js"; // Import the hook

const App = () => {
  const location = useLocation();
  const { data: products, isLoading, error } = useGetProductsQuery(); // Use the query hook to get products

  const hiddenPaths = [
    "/login",
    "/register",
    "/shop-create",
    "/shop-login",
    "/dashboard",
    "/dashboard/cupouns",
    "/dashboard/events",
    "/dashboard/products",
    "/dashboard/orders",
    "/dashboard/reviews",
    "/dashboard/shop",
    "/dashboard/shop-settings",
    "/dashboard/shop-settings/edit",
  ];

  const shouldShowHeader = !hiddenPaths.includes(location.pathname);

  console.log(products);
  return (
    <>
      <ToastContainer />
      {shouldShowHeader && (
        <Header allProducts={products} isLoading={isLoading} error={error} />
      )}
      {isLoading && <div>Loading...</div>}
      {error && <div>Error loading products: {error.message}</div>}
      <Outlet />
    </>
  );
};

export default App;
