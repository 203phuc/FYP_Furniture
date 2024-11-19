import React, { useState } from "react";
import { Link } from "react-router-dom";
import { navItems } from "../../static/data.jsx";
import styles from "../../styles/styles";

const Navbar = ({ active }) => {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`block 800px:${styles.normalFlex} h-full `}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      {navItems &&
        navItems.map((item, index) => {
          const department = item.url.substring(1); // Get the department from the URL (remove the leading '/')
          return (
            <div className="flex h-full items-center" key={index}>
              <Link
                to={{
                  pathname: "/product", // Base path (e.g., "/living", "/dinning", etc.)
                  search: new URLSearchParams({ department }).toString(), // Add department query parameter
                }}
                className={`relative h-full content-center ${
                  active === index + 1
                    ? "text-black"
                    : "text-black 800px:text-black"
                } text-sm pb-[30px] 800px:pb-0 font-[400] px-6 cursor-pointer hover:text-[#1E372F] transition-all duration-300
                before:content-[''] before:absolute before:bottom-0 before:left-0 before:w-0 before:h-[2px] before:bg-[#1E372F] before:transition-all before:duration-300 before:ease-in-out hover:before:w-full`}
              >
                {item.title}
              </Link>

              {/* Dropdown Menu */}
              {open && (
                <div className="absolute top-full left-0 bg-white shadow-lg w-full border border-gray-200 rounded-md z-10">
                  <div className="grid grid-cols-3 gap-6 p-6">
                    {/* Example of submenu categories */}
                    <div>
                      <h4 className="font-bold text-lg mb-2">Seating</h4>
                      <ul>
                        <li>
                          <Link
                            to="/sofas"
                            className="block hover:text-[#1E372F] px-2 py-1"
                          >
                            Sofas
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/sectionals"
                            className="block hover:text-[#1E372F] px-2 py-1"
                          >
                            Sectionals
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/chairs"
                            className="block hover:text-[#1E372F] px-2 py-1"
                          >
                            Chairs
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">
                        Tables & Storage
                      </h4>
                      <ul>
                        <li>
                          <Link
                            to="/coffee-tables"
                            className="block hover:text-[#1E372F] px-2 py-1"
                          >
                            Coffee Tables
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/console-tables"
                            className="block hover:text-[#1E372F] px-2 py-1"
                          >
                            Console Tables
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/media-consoles"
                            className="block hover:text-[#1E372F] px-2 py-1"
                          >
                            Media Consoles
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-bold text-lg mb-2">Lighting</h4>
                      <ul>
                        <li>
                          <Link
                            to="/pendant-lighting"
                            className="block hover:text-[#1E372F] px-2 py-1"
                          >
                            Pendant Lighting
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/floor-lamps"
                            className="block hover:text-[#1E372F] px-2 py-1"
                          >
                            Floor Lamps
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/table-lamps"
                            className="block hover:text-[#1E372F] px-2 py-1"
                          >
                            Table Lamps
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Navbar;
