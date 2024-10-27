import React from "react";

export default function DashboardSideBar({ setActive, active }) {
  const menuItems = [
    "Dashboard",
    "All Orders",
    "All Products",
    "Create Product",
    "All Events",
    "Create Event",
    "Withdraw Money",
    "Shop Inbox",
    "Discount Codes",
    "Refunds",
    "Settings",
  ];

  return (
    <div className="w-64 h-screen bg-white shadow-sm overflow-y-auto sticky top-0 left-0 z-10 font-sans">
      {menuItems.map((item, index) => (
        <div key={index} className="w-full py-1 px-4">
          <button
            className={`w-full text-left text-lg font-light p-2 transition-all duration-300 ease-in-out border-l-4 ${
              active === index + 1
                ? "text-blue-600 border-blue-600 bg-blue-50 font-normal"
                : "text-gray-600 border-transparent hover:bg-gray-100 hover:border-gray-300"
            }`}
            onClick={() => setActive(index + 1)}
          >
            {item}
          </button>
        </div>
      ))}
    </div>
  );
}
