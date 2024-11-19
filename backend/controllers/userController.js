import cloudinary from "cloudinary";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import { sendMail } from "../utils/sendMail.js";

// Generate activation token
const createActivationToken = (user) => {
  return jwt.sign(
    { email: user.email, _id: user._id },
    process.env.ACTIVATION_SECRET,
    { expiresIn: "1h" }
  );
};

// @desc    Authenticate user and set token
// @route   POST /api/users/auth
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      addresses: user.addresses,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(401).json({ message: "Invalid email or password" });
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, addresses, avatar } = req.body;
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const userData = { name, email, password, phoneNumber, addresses };

  if (avatar) {
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });
    userData.avatar = { public_id: myCloud.public_id, url: myCloud.secure_url };
  }

  const user = await User.create(userData);

  if (user) {
    const activationToken = createActivationToken(user);
    await sendMail(user.email, activationToken);
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      addresses: user.addresses,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  } else {
    res.status(400).json({ message: "Invalid user data" });
  }
});

// @desc    Verify user's email
// @route   POST /api/users/verify-email
// @access  Public
const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    res.status(400).json({ message: "Verification token is required" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.ACTIVATION_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    user.isVerified = true;
    await user.save();
    res
      .status(200)
      .json({ message: "Email verified successfully. You can now log in." });
  } catch (error) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// @desc    Logout user and clear token
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler((req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "User logged out" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler((req, res) => {
  console.log("inside the get profile");
  res.status(200).json(req.user);
});

// @desc    Update user profile, avatar, addresses, or password
// @route   PATCH /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const {
      name,
      email,
      phoneNumber,
      addresses,
      avatar,
      oldPassword,
      newPassword,
      confirmPassword,
    } = req.body;
    console.log("address", addresses);
    // Basic info updates
    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;

    // Address updates
    if (Array.isArray(addresses)) {
      addresses.forEach((newAddress) => {
        const existsAddress = user.addresses.findById(newAddress._id);
        if (existsAddress) {
          // Update the existing address with newAddress details
          Object.assign(existsAddress, newAddress);
        } else {
          // Add the newAddress to the addresses array
          user.addresses.push(newAddress);
        }
      });
    } else if (addresses) {
      // Handle single address (if `addresses` is not an array)
      const existsAddress = user.addresses.find((address) =>
        address._id.equals(addresses._id)
      );
      if (existsAddress) {
        Object.assign(existsAddress, addresses);
      } else {
        user.addresses.push(addresses);
      }
    }

    // Avatar update
    if (avatar) {
      if (user.avatar.public_id)
        await cloudinary.v2.uploader.destroy(user.avatar.public_id);
      const myCloud = await cloudinary.v2.uploader.upload(avatar, {
        folder: "avatars",
        width: 150,
      });
      user.avatar = { public_id: myCloud.public_id, url: myCloud.secure_url };
    }

    // Password update
    if (oldPassword && newPassword && confirmPassword) {
      const isPasswordMatched = await user.matchPassword(oldPassword);
      if (!isPasswordMatched)
        return res.status(400).json({ message: "Old password is incorrect" });
      if (newPassword !== confirmPassword)
        return res.status(400).json({ message: "Passwords do not match" });
      user.password = newPassword;
    }

    const updatedUser = await user.save();
    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      addresses: updatedUser.addresses,
      avatar: updatedUser.avatar,
      role: updatedUser.role,
    });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// @desc    Delete user address
// @route   DELETE /api/users/address/:id
// @access  Private
const deleteUserAddress = asyncHandler(async (req, res) => {
  const { id: addressId } = req.params;
  await User.updateOne(
    { _id: req.user._id },
    { $pull: { addresses: { _id: addressId } } }
  );
  res.status(200).json({ message: "Address deleted successfully" });
});

// @desc    Get user information by userId
// @route   GET /api/users/:id
// @access  Public
const getUserInfoById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  user
    ? res.status(200).json(user)
    : res.status(404).json({ message: "User not found" });
});

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 });
  res.status(200).json(users);
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }

  if (user.avatar.public_id)
    await cloudinary.v2.uploader.destroy(user.avatar.public_id);
  await User.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: "User deleted successfully" });
});

export {
  authUser,
  deleteUser,
  deleteUserAddress,
  getAllUsers,
  getUserInfoById,
  getUserProfile,
  logoutUser,
  registerUser,
  updateUserProfile,
  verifyEmail,
};
