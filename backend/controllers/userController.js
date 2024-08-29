import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import cloudinary from "cloudinary";
import generateToken from "../utils/generateToken.js";

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
      createdAt: user.createdAt, // Include createdAt field
      updatedAt: user.updatedAt, // Include updatedAt field
      token: user.token,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phoneNumber, addresses, avatar } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const userData = {
    name,
    email,
    password,
  };

  if (phoneNumber) {
    userData.phoneNumber = phoneNumber;
  }

  if (addresses) {
    userData.addresses = addresses;
  }

  if (avatar) {
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });

    userData.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const user = await User.create(userData);

  if (user) {
    generateToken(res, user._id);
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phoneNumber: user.phoneNumber,
      addresses: user.addresses,
      role: user.role,
      avatar: user.avatar,
      createdAt: user.createdAt, // Automatically included
      updatedAt: user.updatedAt, // Automatically included
      token: user.token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

// @desc    Logout user and clear token
// @route   POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(200).json({ message: "User logged out" });
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    ...req.user._doc,
  };
  res.status(200).json(user);
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    // Update fields from the request body
    if (req.body.name !== undefined) user.name = req.body.name;
    if (req.body.email !== undefined) user.email = req.body.email;
    if (req.body.phoneNumber !== undefined)
      user.phoneNumber = req.body.phoneNumber;
    if (req.body.addresses !== undefined) user.addresses = req.body.addresses;
    if (req.body.avatar !== undefined) user.avatar = req.body.avatar;

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phoneNumber: updatedUser.phoneNumber,
      addresses: updatedUser.addresses,
      role: updatedUser.role,
      avatar: updatedUser.avatar,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// @desc    Update user avatar
// @route   PUT /api/users/update-avatar
// @access  Private
const updateUserAvatar = asyncHandler(async (req, res) => {
  let existsUser = await User.findById(req.user._id);
  if (req.body.avatar !== "") {
    const imageId = existsUser.avatar.public_id;

    await cloudinary.v2.uploader.destroy(imageId);

    const myCloud = await cloudinary.v2.uploader.upload(req.body.avatar, {
      folder: "avatars",
      width: 150,
    });

    existsUser.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  await existsUser.save();

  res.status(200).json({
    success: true,
    user: existsUser,
  });
});

// @desc    Update user addresses
// @route   PUT /api/users/update-user-addresses
// @access  Private
const updateUserAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const sameTypeAddress = user.addresses.find(
    (address) => address.addressType === req.body.addressType
  );
  if (sameTypeAddress) {
    res.status(400);
    throw new Error(`${req.body.addressType} address already exists`);
  }

  const existsAddress = user.addresses.find(
    (address) => address._id === req.body._id
  );

  if (existsAddress) {
    Object.assign(existsAddress, req.body);
  } else {
    // Add the new address to the array
    user.addresses.push(req.body);
  }

  await user.save();

  res.status(200).json({
    success: true,
    user,
  });
});

// @desc    Delete user address
// @route   DELETE /api/users/delete-user-address/:id
// @access  Private
const deleteUserAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const addressId = req.params.id;

  await User.updateOne(
    {
      _id: userId,
    },
    { $pull: { addresses: { _id: addressId } } }
  );

  const user = await User.findById(userId);

  res.status(200).json({ success: true, user });
});

// @desc    Update user password
// @route   PUT /api/users/update-user-password
// @access  Private
const updateUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");

  const isPasswordMatched = await user.matchPassword(req.body.oldPassword);

  if (!isPasswordMatched) {
    res.status(400);
    throw new Error("Old password is incorrect!");
  }

  if (req.body.newPassword !== req.body.confirmPassword) {
    res.status(400);
    throw new Error("Passwords do not match!");
  }
  user.password = req.body.newPassword;

  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully!",
  });
});

// @desc    Get user information by userId
// @route   GET /api/users/user-info/:id
// @access  Public
const getUserInfoById = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500);
    throw new Error(error.message);
  }
});

// @desc    Get all users (admin only)
// @route   GET /api/users/admin-all-users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({
    createdAt: -1,
  });
  res.status(200).json({
    success: true,
    users,
  });
});

// @desc    Delete user (admin only)
// @route   DELETE /api/users/delete-user/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(400);
    throw new Error("User not found");
  }

  const imageId = user.avatar.public_id;

  await cloudinary.v2.uploader.destroy(imageId);

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "User deleted successfully!",
  });
});

export {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  updateUserAvatar,
  updateUserAddresses,
  deleteUserAddress,
  updateUserPassword,
  getUserInfoById,
  getAllUsers,
  deleteUser,
};
