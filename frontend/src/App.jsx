import { Outlet } from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";

const App = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

export default App;
