import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/layout/Header.jsx";
import "./app.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import DashboardHeader from "./components/Shop/Layout/DashboardHeader.jsx";

const App = () => {
  const location = useLocation();
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
  return (
    <>
      <ToastContainer />
      {shouldShowHeader && <Header />}
      <Outlet />
    </>
  );
};

export default App;
