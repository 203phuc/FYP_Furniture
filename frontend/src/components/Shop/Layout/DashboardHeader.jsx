import React from "react";
import { AiOutlineGift } from "react-icons/ai";
import { BiMessageSquareDetail } from "react-icons/bi";
import { FiPackage, FiShoppingBag } from "react-icons/fi";
import { MdOutlineLocalOffer } from "react-icons/md";
import { PiUserCircleFill } from "react-icons/pi";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import logo from "../../../assets/cozniture-high-resolution-logo-transparent.png";
const DashboardHeader = () => {
  const { userInfo } = useSelector((state) => state.auth);
  return (
    <div className="w-full h-[60px] bg-white shadow sticky top-0 left-0 z-30 flex items-center justify-between px-4">
      <div>
        <Link to="/">
          <img src={logo} alt="" className="w-[150px] h-[3  0px]" />
        </Link>
      </div>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <Link to="/dashboard/cupouns" className="800px:block hidden">
            <AiOutlineGift
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-events" className="800px:block hidden">
            <MdOutlineLocalOffer
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-products" className="800px:block hidden">
            <FiShoppingBag
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to="/dashboard-orders" className="800px:block hidden">
            <FiPackage color="#555" size={30} className="mx-5 cursor-pointer" />
          </Link>
          <Link to="/dashboard-messages" className="800px:block hidden">
            <BiMessageSquareDetail
              color="#555"
              size={30}
              className="mx-5 cursor-pointer"
            />
          </Link>
          <Link to={`/shop/${userInfo._id}`}>
            {userInfo.avatar?.url ? (
              <img
                src={`${userInfo.avatar?.url}`}
                alt=""
                className="w-[50px] h-[50px] rounded-full object-cover"
              />
            ) : (
              <PiUserCircleFill size={40} className="mx-5 cursor-pointer" />
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
