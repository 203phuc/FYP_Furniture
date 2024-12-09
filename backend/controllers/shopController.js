import cloudinary from "cloudinary";
import asyncHandler from "express-async-handler";
import Shop from "../models/shopModel.js";
import generateToken from "../utils/generateToken.js";

//@desc    Auth shop/ set token
//@route   POST /api/shops/auth
//@access  Public
const authShop = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const shop = await Shop.findOne({ email });

  if (shop && (await shop.matchPassword(password))) {
    generateToken(res, shop._id);
    res.status(201).json({
      _id: shop._id,
      name: shop.name,
      email: shop.email,
      role: shop.role,
      token: shop.token,
      createdAt: shop.createdAt,
      updatedAt: shop.updatedAt,
      address: shop.address,
      phoneNumber: shop.phoneNumber,
      zipCode: shop.zipCode,
      image: shop.image, // Brand image
      avatar: shop.avatar, // Shop owner or shop avatar
      withdrawMethod: shop.withdrawMethod,
      availableBalance: shop.availableBalance,
    });
  } else {
    res.status(401);
    throw new Error("Invalid email or password");
  }
});

//@desc    Register a new shop
//@route   POST /api/shops
//@access  Public
const registerShop = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    address,
    phoneNumber,
    zipCode,
    image, // Brand image
    avatar, // Shop owner or shop avatar
    withdrawMethod,
    availableBalance,
  } = req.body;

  const existingShop = await Shop.findOne({ email });

  if (existingShop) {
    res.status(400);
    throw new Error("Shop already exists");
  }

  const shopData = {
    name,
    email,
    password,
    address,
    phoneNumber,
    zipCode,
  };

  // Optional fields
  if (withdrawMethod) {
    shopData.withdrawMethod = withdrawMethod;
  }

  if (availableBalance !== undefined) {
    shopData.availableBalance = availableBalance;
  }

  // Handle brand image upload if present
  if (image) {
    const uploadedImage = await cloudinary.v2.uploader.upload(image, {
      folder: "brand_images", // Upload to brand_images folder
    });
    shopData.image = {
      publicId: uploadedImage.public_id,
      url: uploadedImage.secure_url,
    };
  }

  // Handle avatar upload if present
  if (avatar) {
    const uploadedAvatar = await cloudinary.v2.uploader.upload(avatar, {
      folder: "avatars",
    });
    shopData.avatar = {
      publicId: uploadedAvatar.public_id,
      url: uploadedAvatar.secure_url,
    };
  }

  const newShop = await Shop.create(shopData);

  if (newShop) {
    generateToken(res, newShop._id);
    res.status(201).json({
      _id: newShop._id,
      name: newShop.name,
      email: newShop.email,
      address: newShop.address,
      phoneNumber: newShop.phoneNumber,
      zipCode: newShop.zipCode,
      withdrawMethod: newShop.withdrawMethod,
      availableBalance: newShop.availableBalance,
      image: newShop.image, // Brand image
      avatar: newShop.avatar, // Shop or owner avatar
      role: newShop.role,
      createdAt: newShop.createdAt,
      updatedAt: newShop.updatedAt,
      token: newShop.token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid shop data");
  }
});

//@desc    Update shop and seller
//@route   PUT /api/shops/:id
//@access  Private
const updateShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (shop) {
    shop.name = req.body.name || shop.name;
    shop.email = req.body.email || shop.email;
    shop.address = req.body.address || shop.address;
    shop.phoneNumber = req.body.phoneNumber || shop.phoneNumber;
    shop.zipCode = req.body.zipCode || shop.zipCode;
    shop.image = req.body.image || shop.image;
    shop.avatar = req.body.avatar || shop.avatar;
    shop.withdrawMethod = req.body.withdrawMethod || shop.withdrawMethod;
    shop.availableBalance =
      req.body.availableBalance !== undefined
        ? req.body.availableBalance
        : shop.availableBalance;

    const updatedShop = await shop.save();
    res.status(200).json({
      _id: updatedShop._id,
      name: updatedShop.name,
      email: updatedShop.email,
      address: updatedShop.address,
      phoneNumber: updatedShop.phoneNumber,
      zipCode: updatedShop.zipCode,
      image: updatedShop.image,
      avatar: updatedShop.avatar,
      withdrawMethod: updatedShop.withdrawMethod,
      availableBalance: updatedShop.availableBalance,
    });
  } else {
    res.status(404);
    throw new Error("Shop not found");
  }
});

//@desc    Logout shop
//@route   POST /api/shops/logout
//@access  Private
const logoutShop = asyncHandler(async (req, res) => {
  res.cookie("jwt", "logout", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Shop logged out" });
});

//@desc    Delete shop
//@route   DELETE /api/shops/:id
//@access  Private
const deleteShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (shop) {
    await Shop.deleteOne({ _id: shop._id });
    res.json({ message: "Shop removed" });
  } else {
    res.status(404);
    throw new Error("Shop not found");
  }
});

//@desc    Get shop by ID
//@route   GET /api/shops/:id
//@access  Private
const getShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);

  if (shop) {
    res.json(shop);
  } else {
    res.status(404);
    throw new Error("Shop not found");
  }
});

//@desc    Get all shops
//@route   GET /api/shops
//@access  Private
const getShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find({});
  res.json(shops);
});

export {
  authShop,
  deleteShop,
  getShop,
  getShops,
  logoutShop,
  registerShop,
  updateShop,
};
