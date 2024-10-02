import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/slices/authSlice.js";
import { useLogoutMutation } from "../../Redux/slices/userApiSlice.js";
import styles from "../../styles/styles.jsx";
import logo from "../../assets/cozniture-high-resolution-logo-transparent.png";
import Navbar from "./Navbar.jsx";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import "../../app.css";

const Header = ({ allProducts }) => {
  // User section
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputStatus, setInputStatus] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search products...");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);
  //active
  const [active, setActive] = useState(0);

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // Search section
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  return (
    <>
      <div className="border-b border-[#EFEEEB]">
        <div className={`${styles.section} `}>
          <div className="hidden 800px:h-[70px] 800px:py-[20px] 800px:flex items-center flex-row justify-evenly">
            {/* Search Bar */}
            <div className="w-[20%] relative ">
              <input
                type="text"
                placeholder={placeholder}
                value={searchTerm}
                onChange={handleSearchChange}
                className="w-full h-10 px-4 "
                onClick={() => setPlaceholder("hello")}
              />
              <AiOutlineSearch
                size={30}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
              {searchData && searchData.length !== 0 && (
                <div className="absolute bg-white shadow-lg mt-2 w-full max-h-60 overflow-auto z-10">
                  {searchData.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="block p-4 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <img
                          src={`${product.images[0]?.url}`}
                          alt={product.name}
                          className="w-10 h-10 mr-2"
                        />
                        <h5>{product.name}</h5>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* Logo */}
            <div>
              <Link to="/">
                <img
                  src={logo}
                  alt="Cozniture Logo"
                  className="h-10" // Adjust the height as needed
                />
              </Link>
            </div>
            <div className={`${styles.button}`}>
              <Link
                to={`${
                  userInfo && userInfo.role === "seller"
                    ? "/dashboard"
                    : "/shop-create"
                }`}
              >
                <h1 className="text-[#fff] flex items-center">
                  {userInfo && userInfo.role === "seller"
                    ? "Go Dashboard"
                    : "Become Seller"}{" "}
                  <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            </div>

            {/* seller logout */}

            {/* User and Navigation Links */}
            <div className="flex items-center relative">
              {/* seller Section */}

              {/* User Section */}
              {userInfo && userInfo.role === "user" ? (
                <div>
                  <div className="flex">
                    <div className={`${styles.normalFlex}`}>
                      <div
                        className="relative cursor-pointer mr-[15px]"
                        onClick={() => setOpenWishlist(true)}
                      >
                        <AiOutlineHeart size={25} color="black" />
                        <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-3 h-3 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center"></span>
                      </div>
                    </div>

                    <div className={`${styles.normalFlex}`}>
                      <div
                        className="relative cursor-pointer mr-[15px]"
                        onClick={() => setOpenCart(true)}
                      >
                        <AiOutlineShoppingCart
                          size={25}
                          color="black"
                          style={{ strokeWidth: 0.5 }}
                        />
                        <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-3 h-3 top right p-0 m-0 text-white font-mono text-[12px] leading-tight text-center"></span>
                      </div>
                    </div>
                    <div className={`${styles.normalFlex}`}>
                      <div className="relative cursor-pointer mr-[15px]">
                        {userInfo.role === "user" ? (
                          <Link to="/profile">
                            <img
                              src={`${userInfo?.avatar?.url}`}
                              className="w-[35px] h-[35px] rounded-full"
                              alt=""
                            />
                          </Link>
                        ) : (
                          <Link to="/login">
                            <CgProfile size={25} color="black" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center text-slate-950"
                  >
                    <FaUser className="mr-2" /> {userInfo.name}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                      <Link
                        to="/profile"
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        Profile
                      </Link>
                      <button
                        className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                        onClick={logoutHandler}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <div className="relative">
                    <button
                      onClick={() => setIsDropdown1Open(!isDropdown1Open)}
                      className="flex items-center text-slate-950"
                    >
                      <FaUser className="mr-2" />
                    </button>

                    {isDropdown1Open && (
                      <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                        {!userInfo ? (
                          <>
                            <Link
                              to="/login"
                              className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                            >
                              Login
                            </Link>
                            <Link
                              to="/register"
                              className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                            >
                              Register
                            </Link>
                            <Link
                              to="/shop-create"
                              className="w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left flex items-center justify-between"
                            >
                              Shop register{" "}
                              <IoIosArrowForward className="ml-1" />
                            </Link>
                            <Link
                              to="/shop-login"
                              className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                            >
                              Login as seller
                            </Link>
                          </>
                        ) : (
                          <button
                            className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                            onClick={logoutHandler}
                          >
                            Logout
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`${
          active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
        } transition hidden 800px:flex items-center justify-between w-full h-[70px]`}
      >
        <div
          className={`mx-auto h-full relative ${styles.normalFlex} justify-between`}
        >
          <div className={`${styles.normalFlex} h-full`}>
            <Navbar active={active} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
