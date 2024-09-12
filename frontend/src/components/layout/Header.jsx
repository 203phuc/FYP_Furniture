import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Redux/slices/authSlice.js";
import { useLogoutMutation } from "../../Redux/slices/userApiSlice.js";
import styles from "../../styles/styles.jsx";
import logo from "../../assets/cozniture-high-resolution-logo-transparent.png"; // Import your logo here

const Header = ({ allProducts }) => {
  // User section
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdown1Open, setIsDropdown1Open] = useState(false);

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
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
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

          {/* Search Bar */}
          <div className="w-[50%] relative ">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full h-10 px-4 border-2 border-blue-600 rounded-md"
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
          <div className="flex items-center space-x-4 relative">
            {/* seller Section */}

            {/* User Section */}
            {userInfo && userInfo.role === "user" ? (
              <div>
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
                <button
                  onClick={() => setIsDropdown1Open(!isDropdown1Open)}
                  className="flex items-center text-slate-950"
                >
                  <FaUser className="mr-2" /> Account
                </button>
                {isDropdown1Open && !userInfo ? (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
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
                      className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left flex items-center justify-between"
                    >
                      Shop register <IoIosArrowForward className="ml-1" />
                    </Link>
                    <Link
                      to="/shop-login"
                      className="block w-full px-4 py-2 text-gray-700 hover:bg-gray-100 text-left"
                    >
                      Login as seller
                    </Link>
                  </div>
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
      </div>
    </>
  );
};

export default Header;
