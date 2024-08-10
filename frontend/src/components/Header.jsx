import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import { logout } from "../Redux/slices/authSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "../Redux/slices/userApiSlice.js";
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosArrowForward } from "react-icons/io";

const Header = () => {
  // User section
  const { userInfo } = useSelector((state) => state.auth);
  const [logoutApiCall] = useLogoutMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  // Dropdown state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Search section
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    // Assuming you have allProducts from Redux or props
    const filteredProducts =
      allProducts &&
      allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
    setSearchData(filteredProducts);
  };

  return (
    <nav className="bg-dark text-white py-2">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <div className="flex items-center">
          <Link
            to="/"
            className="text-white text-xl font-semibold no-underline"
          >
            COZNITURE
          </Link>
        </div>
        <div className="hidden lg:flex lg:flex-grow lg:justify-center mx-4">
          <div className="relative w-full max-w-lg">
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
                {searchData.map((i) => (
                  <Link
                    key={i._id}
                    to={`/product/${i._id}`}
                    className="block p-4 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <img
                        src={`${i.images[0]?.url}`}
                        alt=""
                        className="w-10 h-10 mr-2"
                      />
                      <h5>{i.name}</h5>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Link to="/shop-create" className="text-white flex items-center">
            Become Seller <IoIosArrowForward className="ml-1" />
          </Link>

          <button className="lg:hidden text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>

          {userInfo ? (
            <div className="relative">
              <button
                className="text-white"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {userInfo.name}
              </button>
              {dropdownOpen && (
                <div className="absolute mt-2 bg-white text-black shadow-lg z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logoutHandler}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="flex items-center text-white hover:text-gray-300"
              >
                <FaUser className="mr-2" /> Login
              </Link>
              <Link
                to="/register"
                className="flex items-center text-white hover:text-gray-300"
              >
                <FaUser className="mr-2" /> Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
