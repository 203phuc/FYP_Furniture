import React from "react";
import { useSelector } from "react-redux";
import { FloatingInput } from "./DeliverySection"; // Assuming FloatingInput is in the same directory

const ContactSection = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <div className="border p-4 rounded-md shadow-sm">
      <h2 className="font-semibold text-lg mb-4">Contact</h2>

      {/* Email Floating Input */}
      <FloatingInput
        label="Email"
        value={userInfo?.email || ""}
        onChange={(e) => {} /* handle email change */}
      />

      {/* Checkbox */}
      <div className="flex items-center mt-4">
        <input type="checkbox" className="mr-2" id="news-offers" />
        <label htmlFor="news-offers" className="text-sm">
          Email me with news and offers
        </label>
      </div>
    </div>
  );
};

export default ContactSection;
