"use client";

import { ChevronDown } from "lucide-react";
import React, { useEffect, useState } from "react";
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
          ${value ? "pt-8 pb-4 text-black text-sm" : "pt-4 pb-4"}`}
      />
      <label
        className={`absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500 transition-all duration-200
          ${value ? "-translate-y-4 text-xs text-black" : ""}`}
      >
        {label}
      </label>
    </div>
  );
};

const DeliverySection = () => {
  const { userInfo } = useSelector((state) => state.auth);

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);
  const [country, setCountry] = useState("");
  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [addressType, setAddressType] = useState("");

  useEffect(() => {
    if (userInfo?.addresses && userInfo.addresses.length > 0) {
      const selectedAddress = userInfo.addresses[selectedAddressIndex];
      setCountry(selectedAddress.country || "");
      setName(userInfo.name || "");
      setAddress1(selectedAddress.address1 || "");
      setAddress2(selectedAddress.address2 || "");
      setZipCode(selectedAddress.zipCode || "");
      setCity(selectedAddress.city || "");
      setAddressType(selectedAddress.addressType || "");
    }
  }, [selectedAddressIndex, userInfo]);

  const handleAddressChange = (e) => {
    setSelectedAddressIndex(Number(e.target.value));
  };

  return (
    <div className="space-y-4">
      <label className="text-lg font-semibold">Delivery</label>

      <div className="relative">
        <select
          value={selectedAddressIndex}
          onChange={handleAddressChange}
          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          {userInfo?.addresses?.map((address, index) => (
            <option key={index} value={index}>
              {address.addressType}: {address.address1}, {address.city}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
          <ChevronDown className="h-4 w-4" />
        </div>
      </div>

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
          value={city}
          onChange={(e) => setCity(e.target.value)}
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
