import { useEffect, useRef, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaUser } from "react-icons/fa";
import { IoIosArrowForward } from "react-icons/io";
import {
  PiHeartThin,
  PiShoppingCartSimpleThin,
  PiUserThin,
} from "react-icons/pi";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import "../../app.css";
import logo from "../../assets/cozniture-high-resolution-logo-transparent.png";
import { logout } from "../../redux/slices/authSlice.js";
import { useLogoutMutation } from "../../redux/slices/userApiSlice.js";
import styles from "../../styles/styles.jsx";
import Navbar from "./Navbar.jsx";

// Custom hook to handle clicks outside of a component
const useOutsideClick = (callback) => {
  const ref = useRef();

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, [callback]);

  return ref;
};

const Header = ({ allProducts }) => {
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputStatus, setInputStatus] = useState(false);
  const [placeholder, setPlaceholder] = useState("Search products...");
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);
  const [active, setActive] = useState(0);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [searchDropdown, setSearchDropdown] = useState(false);

  // Use the custom hook for both dropdowns
  const dropdownRef = useOutsideClick(() => setIsDropdownOpen(false));
  const dropdown1Ref = useOutsideClick(() => setIsDropdown1Open(false));
  const dropdown2Ref = useOutsideClick(() => setSearchDropdown(false));
  const toggleWishlistSidebar = () => {
    setOpenWishlist(!openWishlist);
  };

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    console.log(allProducts);
    const filteredProducts =
      allProducts.products &&
      allProducts.products.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
    setSearchDropdown(true);
  };

  const handleSearchBlur = (e) => {
    // Delay hiding to allow clicks inside the dropdown
    setTimeout(() => {}, 150);
    setIsDropdownOpen(false);
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
                onBlur={handleSearchBlur}
                className="w-full h-10 px-4 "
                onClick={() => setPlaceholder("hello")}
              />
              <AiOutlineSearch
                size={30}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              />
              {searchData && searchData.length !== 0 && searchDropdown && (
                <div
                  ref={dropdown2Ref}
                  className="absolute bg-white shadow-lg mt-2 w-full max-h-60 overflow-auto z-10"
                >
                  {searchData.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product._id}`}
                      className="block p-4 hover:bg-gray-100"
                    >
                      <div className="flex items-center">
                        <img
                          src={`${product.variants[0]?.mainImage.url}`}
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
                <img src={logo} alt="Cozniture Logo" className="h-10" />
              </Link>
            </div>
            <div className={`${styles.button} `}>
              <Link
                to={`${
                  userInfo && userInfo.role === "admin"
                    ? "/admin-dashboard"
                    : userInfo && userInfo.role === "seller"
                    ? "/dashboard"
                    : "/shop-create"
                }`}
              >
                <h1 className="text-[#fff] flex items-center font-light text-lg">
                  {userInfo && userInfo.role === "admin"
                    ? "Go Dashboard"
                    : userInfo && userInfo.role === "seller"
                    ? "Go Dashboard"
                    : "Become Seller"}{" "}
                  <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            </div>

            {/* User and Navigation Links */}
            <div className="flex items-center relative">
              {userInfo && userInfo.role === "user" ? (
                <div>
                  <div className="flex">
                    <div className={`${styles.normalFlex}`}>
                      <div
                        className="relative cursor-pointer mr-[15px]"
                        onClick={() => setOpenWishlist(true)}
                      >
                        <PiHeartThin size={25} color="black" />
                        <span className="absolute right-0 top-0 rounded-full bg-[#ffffff] w-3 h-3 top right p-0 m-0 text-black font-mono text-[9px] leading-tight text-center">
                          {wishlist && wishlist.length}
                        </span>
                      </div>
                    </div>

                    <div className={`${styles.normalFlex}`}>
                      <Link
                        to={`/cart/${userInfo._id}`}
                        className="relative cursor-pointer mr-[15px]"
                      >
                        <PiShoppingCartSimpleThin size={25} color="black" />
                        <span className="absolute right-0 top-0 rounded-full bg-[#fcfcfc] w-3 h-3  right p-0 m-0 text-black font-mono text-[9px] leading-tight text-center font-light">
                          {cart && cart.items.length}
                        </span>
                      </Link>
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
                            <PiUserThin size={25} color="black" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  <div ref={dropdownRef}>
                    <button
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      className="flex items-center text-slate-950"
                    >
                      <PiUserThin className="mr-2" /> {userInfo.name}
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
                </div>
              ) : (
                <div className="relative" ref={dropdown1Ref}>
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
      {/* Wishlist Sidebar */}
      {openWishlist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-20">
          <div className="w-[300px] bg-white p-4 fixed top-0 right-0 h-full overflow-auto">
            <h3 className="font-bold text-xl mb-4">Wishlist</h3>
            <ul>
              {wishlist.length > 0 ? (
                wishlist.map((item, index) => (
                  <li key={index} className="mb-2">
                    <div className="flex items-center">
                      <img
                        src={`${item.variants[0].mainImage.url}`}
                        alt={item.name}
                        className="w-12 h-12 mr-4"
                      />
                      <div>
                        <h4 className="text-xl font-thin text-gray-900">
                          {item.name}
                        </h4>
                        <p className="text-gray-600">Department: </p>
                        <p className="text-gray-600">{item.department}</p>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <p>No items in wishlist</p>
              )}
            </ul>
            <button
              onClick={toggleWishlistSidebar}
              className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
