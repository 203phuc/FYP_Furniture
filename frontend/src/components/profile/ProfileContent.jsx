import React, { useEffect, useState } from "react";
import { AiOutlineCamera, AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setCredentials } from "../../redux/slices/authSlice.js";
import {
  useGetUserProfileQuery,
  useProfileMutation,
} from "../../redux/slices/userApiSlice.js";
import FormContainer from "../layout/FormContainer.jsx";

const ProfileContent = ({ active }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [address, setAddress] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [updatedAt, setUpdatedAt] = useState("");

  const { data: userInfo } = useGetUserProfileQuery();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();

  const handleImage = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };
  const parseDate = (date) => (date ? new Date(date).toISOString() : null);
  useEffect(() => {
    if (userInfo) {
      // Add this check
      console.log(userInfo);
      setName(userInfo.name || "");
      setEmail(userInfo.email || "");
      setPhoneNumber(userInfo.phoneNumber || "");
      setAddress(userInfo.address || "");
      setCreatedAt(parseDate(userInfo.createdAt));
      setUpdatedAt(parseDate(userInfo.updatedAt));
    }
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      const data = await updateProfile({
        name,
        email,
        phoneNumber,
      }).unwrap();
      dispatch(setCredentials(data));
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      {active === 1 && (
        <FormContainer>
          <div className="flex justify-center w-full">
            <div className="relative">
              <img
                src={`${userInfo?.avatar?.url}`}
                className="w-[150px] h-[150px] rounded-full object-cover border-[3px] border-[#3ad132]"
                alt=""
              />
              <div className="w-[30px] h-[30px] bg-[#E3E9EE] rounded-full flex items-center justify-center cursor-pointer absolute bottom-[5px] right-[5px]">
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  onChange={handleImage}
                />
                <label htmlFor="image">
                  <AiOutlineCamera />
                </label>
              </div>
            </div>
          </div>
          <br />
          <br />
          <h1 className="text-2xl font-bold mb-4 text-center">Profile</h1>
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number
                </label>
                <div className="mt-1">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    autoComplete="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label
                  htmlFor="createdDate"
                  className="block text-sm font-medium text-gray-700"
                >
                  Created Date
                </label>
                <div className="mt-1">
                  <input
                    id="createdDate"
                    name="createdDate"
                    type="text"
                    value={new Date(createdAt).toLocaleDateString()} // Format the date
                    readOnly // Prevent editing
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button
                onClick={submitHandler}
                type="submit"
                className="mt-3 w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Profile
              </button>
            </div>
          </div>
        </FormContainer>
      )}
      {active === 7 && <Address userInfo={userInfo} />}
    </>
  );
};

const Address = ({ userInfo }) => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [addressType, setAddressType] = useState("");
  const [addresses, setAddresses] = useState([]);
  const dispatch = useDispatch();
  const [addAddress, { isLoading }] = useProfileMutation();
  // Address types
  const addressTypeData = [
    { name: "Default" },
    { name: "home" },
    { name: "office" },
  ];
  useEffect(() => {
    if (
      city &&
      country &&
      addressType &&
      address1 &&
      zipCode &&
      address2 &&
      userInfo
    ) {
      setAddresses([
        ...addresses,
        {
          country,
          city,
          zipCode,
          address1,
          address2,
          addressType,
        },
      ]);
    }
  }, [city, country, addressType, address1, zipCode, address2, userInfo]);
  // Form Submission Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("form submitted");

    console.log(addresses);
    // Validation
    if (!addressType || !country || !city) {
      toast.error("Please fill all the required fields!");
      return;
    }

    try {
      // Dispatch the address addition (replace with actual function)
      await addAddress({
        addresses,
      }).unwrap();

      // Reset form
      setOpen(false);
      setCountry("");
      setCity("");
      setZipCode("");
      setAddress1("");
      setAddress2("");
      setAddressType("");
      toast.success("Address added successfully!");
    } catch (error) {
      toast.error("Failed to add address!");
      console.log(error);
    }
  };

  // Delete Address Handler
  const handleDelete = (item) => {
    try {
      const id = item._id;
      dispatch(deleteUserAddress(id)); // Replace with actual delete logic
      toast.success("Address deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete address!");
    }
  };

  return (
    <div className="w-full px-5">
      {/* Modal for Adding Address */}
      {open && (
        <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center">
          <div className="w-[35%] h-[80vh] bg-white rounded shadow relative overflow-y-scroll">
            <div className="w-full flex justify-end p-3">
              <RxCross1
                size={30}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>
            <h1 className="text-center text-2xl font-semibold">
              Add New Address
            </h1>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="pb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Country <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Country"
                  className="block w-full px-3 py-2 border rounded-md"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div className="pb-2">
                <label className="block text-sm font-medium text-gray-700">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="City"
                  className="block w-full px-3 py-2 border rounded-md"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="pb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 1
                </label>
                <input
                  type="text"
                  placeholder="Address Line 1"
                  className="block w-full px-3 py-2 border rounded-md"
                  value={address1}
                  onChange={(e) => setAddress1(e.target.value)}
                />
              </div>
              <div className="pb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Line 2
                </label>
                <input
                  type="text"
                  placeholder="Address Line 2"
                  className="block w-full px-3 py-2 border rounded-md"
                  value={address2}
                  onChange={(e) => setAddress2(e.target.value)}
                />
              </div>
              <div className="pb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Zip Code
                </label>
                <input
                  type="text"
                  placeholder="Zip Code"
                  className="block w-full px-3 py-2 border rounded-md"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
              <div className="pb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Address Type <span className="text-red-500">*</span>
                </label>
                <select
                  className="block w-full px-3 py-2 border rounded-md"
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                >
                  <option value="">Select Address Type</option>
                  {addressTypeData.map((type) => (
                    <option key={type.name} value={type.name}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="mt-4 w-full py-2 bg-blue-600 text-white rounded-md"
              >
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Address List */}
      <div className="flex items-center justify-between">
        <h1 className="text-[25px] font-semibold">My Addresses</h1>
        <button
          className="px-4 py-2 bg-black text-white rounded-md"
          onClick={() => setOpen(true)}
        >
          Add New
        </button>
      </div>

      {userInfo?.addresses?.length ? (
        userInfo.addresses.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-4 bg-white shadow rounded-md my-3"
          >
            <div>
              <p className="font-semibold">{item.addressType}</p>
              <p>{`${item.address1}, ${item.address2}, ${item.city}, ${item.country}`}</p>
            </div>
            <AiOutlineDelete
              size={25}
              className="cursor-pointer text-red-600"
              onClick={() => handleDelete(item)}
            />
          </div>
        ))
      ) : (
        <p className="text-center mt-4">No addresses found!</p>
      )}
    </div>
  );
};

export default ProfileContent;
