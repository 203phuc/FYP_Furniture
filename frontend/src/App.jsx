import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./app.css";
import Footer from "./components/layout/Footer.jsx";
import Header from "./components/layout/Header.jsx";
import "./index.css";
import {
  useFetchCartQuery,
  useSyncCartMutation,
} from "./redux/slices/cartApiSlice";
import { updateCart } from "./redux/slices/cartSlice";
import { useGetProductApprovedQuery } from "./redux/slices/productApiSlice";

const App = () => {
  const location = useLocation();
  const {
    data: products = [], // Default to empty array
    isLoading: productsLoading,
    error: productsError,
  } = useGetProductApprovedQuery();
  const { userInfo } = useSelector((state) => state.auth);
  const userId = userInfo?._id;
  const [syncCart] = useSyncCartMutation();
  const {
    data: cartData,
    isLoading: cartLoading,
    error: cartError,
  } = useFetchCartQuery(userId, {
    skip: !userId,
  });

  const previousCart = useRef(cartData); // Ref to store previous cart data

  // Sync cart only if it changes and if it's empty
  useEffect(() => {
    if (userId && cartData && cartData.cart?.items?.length === 0) {
      console.log("Syncing in the app");
      // Only sync if the cart is empty and it's a new sync attempt
      if (JSON.stringify(previousCart.current) !== JSON.stringify(cartData)) {
        syncCart({ user_id: userId, items: [] })
          .unwrap()
          .then(() => {
            console.log("Cart synced successfully for empty cart.");
            previousCart.current = cartData; // Update ref with current cart data
          })
          .catch((error) => {
            console.error("Failed to sync empty cart:", error);
            toast.error("Failed to sync empty cart.");
          });
      }
    }
  }, [cartData, userId, syncCart]);

  const dispatch = useDispatch();

  // Update cart in Redux store
  useEffect(() => {
    if (cartData?.cart?.items) {
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
      {cartLoading && <div>Loading...</div>}
      {cartError && toast.error(cartError.message || "Failed to fetch cart")}
      <Outlet />
      {shouldShowHeader && <Footer />}
    </>
  );
};

export default App;
