import React, { useState } from "react";
import { useSelector } from "react-redux";

const FloatingInput = ({ label, value, onChange }) => {
  return (
    <div className="relative mt-4">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder=" "
        className={`block w-full h-12 border border-gray-300 focus:outline-none focus:border-black px-2 py-4 leading-7
          ${value ? "pt-8 pb-4 text-black text-sm" : "pt-4 pb-4"}`} // Only apply padding change when there's a value
      />
      <label
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200
          ${value ? "-translate-y-4 text-xs text-black" : ""}`} // Only move label up when there's a value
      >
        {label}
      </label>
    </div>
  );
};

const DeliverySection = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [country, setCountry] = useState(userInfo?.addresses[0]?.country || "");
  const [name, setName] = useState(userInfo?.name || "");
  const [address1, setAddress1] = useState(
    userInfo?.addresses[0]?.addressLine1 || ""
  );
  const [address2, setAddress2] = useState(
    userInfo?.addresses[0]?.addressLine2 || ""
  );
  const [zipCode, setZipCode] = useState(userInfo?.addresses[0]?.zipCode || "");
  const [city, setCity] = useState(userInfo?.addresses[0]?.city || "");
  const [addressType, setAddressType] = useState(
    userInfo?.addresses[0]?.addressType || "" // Default
  );

  return (
    <div>
      <label className="text-lg font-semibold">Delivery</label>

      <FloatingInput
        label="Country/region"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />
      <FloatingInput
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <FloatingInput
        label="Address Line 1"
        value={address1}
        onChange={(e) => setAddress1(e.target.value)}
      />
      <FloatingInput
        label="Address Line 2"
        value={address2}
        onChange={(e) => setAddress2(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-2">
        <FloatingInput
          label="City"
          value={userInfo?.addresses[0]?.city || ""}
          onChange={() => {}}
        />
        <FloatingInput
          label="Zip Code"
          value={zipCode}
          onChange={(e) => setZipCode(e.target.value)}
        />
      </div>
      <FloatingInput
        label="Address Type"
        value={addressType}
        onChange={(e) => setAddressType(e.target.value)}
      />
    </div>
  );
};

export { DeliverySection as default, FloatingInput };
