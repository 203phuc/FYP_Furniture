import React, { useEffect, useState } from "react";
import { RxAvatar } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormContainer from "../components/layout/FormContainer.jsx";
import Loader from "../components/layout/Loader.jsx";
import { setCredentials } from "../redux/slices/authSlice.js";
import { useRegisterMutation } from "../redux/slices/userApiSlice.js";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [avatar, setAvatar] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);
  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const handleFileInputChange = (e) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  // Phone number validation function
  const validatePhoneNumber = (number) => {
    const phoneRegex = /^[0-9]{10,15}$/; // Adjust the length as needed
    return phoneRegex.test(number);
  };

  // Email format validation function
  const validateEmailFormat = (email) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Validate email format
    if (!validateEmailFormat(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Validate password match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Validate phone number format
    if (!validatePhoneNumber(phoneNumber)) {
      toast.error("Please enter a valid phone number");
      return;
    }

    try {
      const res = await register({
        name,
        email,
        password,
        phoneNumber,
        avatar,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
      console.log(err?.data?.message || err.error);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <FormContainer title="Register">
      <form onSubmit={submitHandler} className="space-y-4">
        <div className="form-group">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="phoneNumber"
            className="block text-sm font-medium text-gray-700"
          >
            Phone Number
          </label>
          <input
            type="number"
            id="phoneNumber"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label
            htmlFor="avatar"
            className="block text-sm font-medium text-gray-700"
          >
            Avatar
          </label>
          <div className="mt-2 flex items-center">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
              {avatar ? (
                <img
                  src={avatar}
                  alt="avatar"
                  className="h-full w-full object-cover rounded-full"
                />
              ) : (
                <RxAvatar className="h-12 w-12 text-gray-300" />
              )}
            </span>
            <input
              type="file"
              id="avatar"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileInputChange}
              className="ml-5 block w-full text-sm text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        {isLoading && <Loader />}
        <button
          type="submit"
          className="mt-3 w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Submit
        </button>
      </form>
      <div className="py-3">
        <span>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </span>
      </div>
    </FormContainer>
  );
};

export default RegisterPage;
