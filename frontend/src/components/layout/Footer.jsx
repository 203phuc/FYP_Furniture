import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white text-black py-8 font-Roboto font-light">
      <div className="container mx-auto px-4 md:px-20 pt-10">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-6">
            <h3 className="text-sm font-medium mb-4">About Us</h3>
            <p className="text-sm leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-6">
            <h3 className="text-sm font-medium mb-4">Quick Links</h3>
            <ul className="list-none">
              {["Home", "Services", "About", "Contact"].map((item) => (
                <li key={item} className="mb-2">
                  <Link
                    to={`/${item.toLowerCase()}`}
                    className="text-sm text-black hover:text-gray-600 transition-colors duration-300"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-6">
            <h3 className="text-sm font-medium mb-4">Contact Us</h3>
            <p className="text-sm mb-2">
              Email:{" "}
              <a
                href="mailto:info@example.com"
                className="text-black hover:text-gray-600 transition-colors duration-300"
              >
                info@example.com
              </a>
            </p>
            <p className="text-sm">
              Phone: <span className="text-black">+123 456 7890</span>
            </p>
          </div>
          <div className="w-full md:w-1/4 md:border-l md:border-gray-200 pl-0 md:pl-6 mb-6">
            <h3 className="text-sm font-medium mb-4">Newsletter</h3>
            <form className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 bg-gray-100 text-sm rounded-md focus:outline-none focus:ring-2 focus:ring-gray-200"
                required
              />
              <button
                type="submit"
                className="px-3 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-700 transition-colors duration-300"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-wrap justify-between items-center">
            <p className="text-sm">
              &copy; 2023 Your Company. All Rights Reserved.
            </p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-300"
                  >
                    <Icon size={20} />
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
