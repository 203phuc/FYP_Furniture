import React from "react";
import { AiOutlineFolderAdd, AiOutlineGift } from "react-icons/ai";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import { VscNewFile } from "react-icons/vsc";
import { CiMoneyBill, CiSettings } from "react-icons/ci";
import { BiMessageSquareDetail } from "react-icons/bi";
import { HiOutlineReceiptRefund } from "react-icons/hi";

const DashboardSideBar = ({ setActive, active }) => {
  return (
    <div className="w-full h-[90vh] bg-white shadow-sm overflow-y-scroll sticky top-0 left-0 z-10">
      {/* single item */}
      <div className="w-full flex items-center p-4">
        <div
          className="flex items-center cursor-pointer w-full mb-8"
          onClick={() => setActive(1)}
        >
          <RxDashboard
            size={30}
            color={`${active === 1 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 1 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Dashboard
          </h5>
        </div>
      </div>

      <div className="w-full flex items-center p-4">
        <div className="w-full flex items-center" onClick={() => setActive(2)}>
          <FiShoppingBag
            size={30}
            color={`${active === 2 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 2 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Orders
          </h5>
        </div>
      </div>

      <div className="w-full flex items-center p-4">
        <div className="w-full flex items-center" onClick={() => setActive(3)}>
          <FiPackage size={30} color={`${active === 3 ? "crimson" : "#555"}`} />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 3 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Products
          </h5>
        </div>
      </div>

      <div className="w-full flex items-center p-4">
        <div className="w-full flex items-center" onClick={() => setActive(4)}>
          <AiOutlineFolderAdd
            size={30}
            color={`${active === 4 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 4 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Create Product
          </h5>
        </div>
      </div>

      <div className="w-full flex items-center p-4">
        <div className="w-full flex items-center" onClick={() => setActive(5)}>
          <MdOutlineLocalOffer
            size={30}
            color={`${active === 5 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 5 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            All Events
          </h5>
        </div>
      </div>

      <div className="w-full flex items-center p-4">
        <div className="w-full flex items-center" onClick={() => setActive(6)}>
          <VscNewFile
            size={30}
            color={`${active === 6 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 6 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Create Event
          </h5>
        </div>
      </div>

      <div className="w-full flex items-center p-4">
        <div className="w-full flex items-center" onClick={() => setActive(7)}>
          <CiMoneyBill
            size={30}
            color={`${active === 7 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 7 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Withdraw Money
          </h5>
        </div>
      </div>

      <div className="w-full flex items-center p-4">
        <div className="w-full flex items-center" onClick={() => setActive(8)}>
          <BiMessageSquareDetail
            size={30}
            color={`${active === 8 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 8 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Shop Inbox
          </h5>
        </div>
      </div>

      <div className="w-full flex items-center p-4">
        <div className="w-full flex items-center" onClick={() => setActive(9)}>
          <AiOutlineGift
            size={30}
            color={`${active === 9 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 9 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Discount Codes
          </h5>
        </div>
      </div>

      <div className="w-full flex items-center p-4">
        <div className="w-full flex items-center" onClick={() => setActive(10)}>
          <HiOutlineReceiptRefund
            size={30}
            color={`${active === 10 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 10 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Refunds
          </h5>
        </div>
      </div>

      <div className="w-full flex items-center p-4">
        <div className="w-full flex items-center" onClick={() => setActive(11)}>
          <CiSettings
            size={30}
            color={`${active === 11 ? "crimson" : "#555"}`}
          />
          <h5
            className={`hidden 800px:block pl-2 text-[18px] font-[400] ${
              active === 11 ? "text-[crimson]" : "text-[#555]"
            }`}
          >
            Settings
          </h5>
        </div>
      </div>
    </div>
  );
};

export default DashboardSideBar;
