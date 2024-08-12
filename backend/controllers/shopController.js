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
      token: shop.token,
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
  const { name, email, password, description, address, phoneNumber, zipCode } =
    req.body;

  const existingShop = await Shop.findOne({ email });
  if (existingShop) {
    res.status(400);
    throw new Error("Shop already exists");
  }

  const newShop = await Shop.create({
    name,
    email,
    password,
    description,
    address,
    phoneNumber,
    zipCode,
  });

  if (newShop) {
    generateToken(res, newShop._id);
    res.status(201).json({
      _id: newShop._id,
      name: newShop.name,
      email: newShop.email,
      token: newShop.token,
    });
  } else {
    res.status(400);
    throw new Error("Invalid shop data");
  }
});

//generate a update shop api
//@desc    Update shop and seller
//@route   PUT /api/shops/:id
//@access  Private
const updateShop = asyncHandler(async (req, res) => {
  const shop = await Shop.findById(req.params.id);
  if (shop) {
    shop.name = req.body.name || shop.name;
    shop.email = req.body.email || shop.email;
    shop.description = req.body.description || shop.description;
    shop.address = req.body.address || shop.address;
    shop.phoneNumber = req.body.phoneNumber || shop.phoneNumber;
    shop.zipCode = req.body.zipCode || shop.zipCode;
    const updatedShop = await shop.save();
    res.status(200).json({
      _id: updatedShop._id,
      name: updatedShop.name,
      email: updatedShop.email,
      description: updatedShop.description,
      address: updatedShop.address,
      phoneNumber: updatedShop.phoneNumber,
      zipCode: updatedShop.zipCode,
    });
  } else {
    res.status(404);
    throw new Error("Shop not found");
  }
});

//generate a logoutshop
//@desc    Logout shop
//@route   POST /api/shops/logout
//@access  Private
const logoutShop = asyncHandler(async (req, res) => {
  res.cookie("jwt", "logout", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "seller Logged out" });
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

//@desc    Get shop
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

//get all shops
//@desc    Get all shops
//@route   GET /api/shops
//@access  Private
const getShops = asyncHandler(async (req, res) => {
  const shops = await Shop.find({});
  res.json(shops);
});

export {
  authShop,
  registerShop,
  updateShop,
  deleteShop,
  getShop,
  getShops,
  logoutShop,
};
