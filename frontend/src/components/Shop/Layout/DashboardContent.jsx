import React from "react";
import DashboardHero from "../DashboardHero.jsx";
import CreateProduct from "../CreateProduct.jsx";

const DashboardContent = ({ active }) => {
  const content = {
    1: <DashboardHero />,
    2: <div>Content for section 2</div>,
    3: <div>Content for section 3</div>,
    4: <CreateProduct />,
    5: <div>Content for section 5</div>,
  };

  // Return the corresponding content based on the active prop, or fallback to a default (e.g., section 1)
  return content[active] || <DashboardHero />;
};

export default DashboardContent;
