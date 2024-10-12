import React from "react";
import AllProducts from "../AllProducts.jsx";
import CreateProduct from "../CreateProduct.jsx";
import DashboardHero from "../DashboardHero.jsx";

const DashboardContent = ({ active }) => {
  const content = {
    1: <DashboardHero />,
    2: <div>Content for section 2</div>,
    3: <AllProducts />,
    4: <CreateProduct />,
    5: <div>Content for section 5</div>,
  };

  // Return the corresponding content based on the active prop, or fallback to a default (e.g., section 1)
  return content[active] || <DashboardHero />;
};

export default DashboardContent;
