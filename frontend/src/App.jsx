import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/layout/Header.jsx";
import "./index.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const location = useLocation();
  const shouldShowHeader =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/shop-create" &&
    location.pathname !== "/shop-login";
  return (
    <>
      <ToastContainer />
      {shouldShowHeader && <Header />}
      <Outlet />
    </>
  );
};

export default App;
