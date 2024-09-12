import React, { useState, useEffect } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useLoginShopMutation } from "../../Redux/slices/shopApiSlice.js";
import FormContainer from "../../components/layout/FormContainer.jsx";
import { setCredentials } from "../../Redux/slices/authSlice.js";
import { useDispatch, useSelector } from "react-redux"; // Adjust the import path as needed

const ShopLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);

  const [loginShop, { isLoading }] = useLoginShopMutation();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth); // Adjust the state path as needed

  useEffect(() => {
    if (userInfo && userInfo.role === "seller") {
      navigate("/");
    }
  }, [userInfo, navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginShop({ email, password }).unwrap();
      dispatch(setCredentials({ ...data }));
      navigate("/");
      window.location.reload(true);
    } catch (err) {
      toast.error(err.data?.message || "Login Failed!");
    }
  };

  return (
    <FormContainer title="Login to your shop">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email address
          </label>
          <div className="mt-1">
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <div className="mt-1 relative">
            <input
              type={visible ? "text" : "password"}
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {visible ? (
              <AiOutlineEye
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                onClick={() => setVisible(false)}
              />
            ) : (
              <AiOutlineEyeInvisible
                className="absolute right-2 top-2 cursor-pointer"
                size={25}
                onClick={() => setVisible(true)}
              />
            )}
          </div>
        </div>
        <div className="flex justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              name="remember-me"
              id="remember-me"
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="remember-me"
              className="ml-2 block text-sm text-gray-900"
            >
              Remember me
            </label>
          </div>
          <div className="text-sm">
            <Link
              to="/forgot-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              Forgot your password?
            </Link>
          </div>
        </div>
        <div>
          <button
            type="submit"
            className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Submit
          </button>
        </div>
        <div className="flex justify-center w-full">
          <h4>Not have any account?</h4>
          <Link to="/shop-create" className="text-blue-600 pl-2">
            create account as seller
          </Link>
        </div>
      </form>
    </FormContainer>
  );
};

export default ShopLoginPage;
