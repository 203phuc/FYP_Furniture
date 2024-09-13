import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import Shop from "../models/shopModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token; // get token from header

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next(); // go to next middleware
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});
// User must be a seller
const isSeller = asyncHandler(async (req, res, next) => {
  try {
    const seller_token = req.cookies.jwt;
    if (!seller_token) {
      return next(new Error("Please login to continue", 401));
    }

    const decoded = jwt.verify(seller_token, process.env.JWT_SECRET);

    req.seller = await Shop.findById(decoded.id);

    next();
  } catch (error) {
    console.error(error);
    res.status(401);
    throw new Error("Not authorized, invalid token");
  }
});

// User must be an admin
const isAdmin = asyncHandler((req, res, next) => {
  if (req.user.role.toUpperCase() === "ADMIN") {
    next();
  } else {
    res.status(401);
    throw new Error("Not authorized as an admin");
  }
});

export { protect, isSeller, isAdmin };
