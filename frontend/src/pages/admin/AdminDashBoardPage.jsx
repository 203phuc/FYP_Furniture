import React, { useEffect, useState } from "react";
import AdminDashboardContent from "../../components/Admin/Layout/AdminDashBoardContent";
import AdminHeader from "../../components/Admin/Layout/AdminHeader.jsx";
import AdminSideBar from "../../components/Admin/Layout/AdminSideBar.jsx";

const AdminDashboardPage = () => {
  const savedActiveTab = localStorage.getItem("adminActiveTab");
  const [active, setActive] = useState(
    savedActiveTab ? parseInt(savedActiveTab) : 1
  );
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    localStorage.setItem("adminActiveTab", active);
  }, [active]);

  return (
    <div>
      <AdminHeader toggleSidebar={toggleSidebar} />
      <div className="w-full flex">
        <div className="flex items-start justify-between w-full">
          <div className="w-[80px] 800px:w-[330px]">
            <AdminSideBar active={active} setActive={setActive} />
          </div>
          <AdminDashboardContent active={active} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
