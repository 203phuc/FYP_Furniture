import React from "react";
import { AiOutlineLogout, AiOutlineUser } from "react-icons/ai";
import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <div className="w-full flex justify-between items-center p-4 bg-[#2c3e50] text-white">
      <div className="text-2xl font-bold">
        <Link to="/admin-dashboard">Admin Dashboard</Link>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <AiOutlineUser size={24} />
          <span>Admin</span>
        </div>
        <button className="flex items-center space-x-2">
          <AiOutlineLogout size={24} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminHeader;
