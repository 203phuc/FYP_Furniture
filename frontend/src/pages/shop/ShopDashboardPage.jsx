import React, { useState } from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader.jsx";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar.jsx";
import DashboardContent from "../../components/Shop/Layout/DashboardContent.jsx";

const ShopDashboardPage = () => {
  const [active, setActive] = useState(1);
  console.log(active);

  return (
    <div>
      <DashboardHeader />
      <div className="flex items-start justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={active} setActive={setActive} />
        </div>
        <div className="w-full justify-center flex">
          <DashboardContent active={active} />
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardPage;
