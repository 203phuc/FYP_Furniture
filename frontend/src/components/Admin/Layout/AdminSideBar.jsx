import React from "react";
import {
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineUser,
} from "react-icons/ai";
import { MdSettings } from "react-icons/md";

const AdminSideBar = ({ active, setActive }) => {
  const menuItems = [
    { name: "Dashboard", icon: <AiOutlineHome size={20} />, index: 1 },
    { name: "All Users", icon: <AiOutlineUser size={20} />, index: 2 },
    {
      name: "All Products",
      icon: <AiOutlineShoppingCart size={20} />,
      index: 3,
    },
    { name: "Settings", icon: <MdSettings size={20} />, index: 4 },
  ];

  return (
    <div className="w-[250px] h-screen bg-[#34495e] text-white p-4">
      <div className="text-xl font-semibold mb-8">Admin Menu</div>
      <ul className="space-y-6">
        {menuItems.map((item) => (
          <li key={item.index}>
            <button
              className={`flex items-center space-x-2 w-full text-left ${
                active === item.index ? "text-[#1abc9c]" : ""
              }`}
              onClick={() => setActive(item.index)}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminSideBar;
