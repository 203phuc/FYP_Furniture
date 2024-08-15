import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/Header.jsx";
import "./index.css";

const App = () => {
  const location = useLocation();
  const shouldShowHeader =
    location.pathname !== "/login" &&
    location.pathname !== "/register" &&
    location.pathname !== "/shop-create" &&
    location.pathname !== "/shop-login";
  return (
    <>
      {shouldShowHeader && <Header />}
      <Outlet />
    </>
  );
};

export default App;
