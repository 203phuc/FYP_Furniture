import React from "react";
import AdminAllProducts from "../AdminAllProducts.jsx";
// import CreateProduct from "../CreateProduct.jsx";
// import DashboardHero from "../DashboardHero.jsx";
import AdminAllUsers from "../AdminAllUsers.jsx";
import AdminDashboardMain from "../AdminDashboardMain";

const AdminDashboardContent = ({ active }) => {
  const content = {
    1: <AdminDashboardMain />,
    2: <AdminAllUsers />,
    3: <AdminAllProducts />,
    4: <div>Content for section 4</div>,
    5: <div>Content for section 5</div>,
  };

  // Return the corresponding content based on the active prop, or fallback to a default (e.g., section 1)
  return content[active] || <DashboardHero />;
};

export default AdminDashboardContent;
