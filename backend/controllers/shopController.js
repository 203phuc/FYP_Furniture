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
    phone_number,
    zipcode,
    image,
    avatar,
    withdraw_method,
    available_balance,
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
    phone_number,
    zipcode,
  };

  // Optional fields
  if (image) {
    shopData.image = image;
  }

  if (avatar) {
    shopData.avatar = avatar;
  }

  if (withdraw_method) {
    shopData.withdraw_method = withdraw_method;
  }

  if (available_balance !== undefined) {
    shopData.available_balance = available_balance;
  }

  const newShop = await Shop.create(shopData);

  if (newShop) {
    generateToken(res, newShop._id);
    res.status(201).json({
      _id: newShop._id,
      name: newShop.name,
      email: newShop.email,
      role: newShop.role,
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
    shop.phone_number = req.body.phone_number || shop.phone_number;
    shop.zipcode = req.body.zipcode || shop.zipcode;
    shop.image = req.body.image || shop.image;
    shop.avatar = req.body.avatar || shop.avatar;
    shop.withdraw_method = req.body.withdraw_method || shop.withdraw_method;
    shop.available_balance =
      req.body.available_balance !== undefined
        ? req.body.available_balance
        : shop.available_balance;

    const updatedShop = await shop.save();
    res.status(200).json({
      _id: updatedShop._id,
      name: updatedShop.name,
      email: updatedShop.email,
      address: updatedShop.address,
      phone_number: updatedShop.phone_number,
      zipcode: updatedShop.zipcode,
      image: updatedShop.image,
      avatar: updatedShop.avatar,
      withdraw_method: updatedShop.withdraw_method,
      available_balance: updatedShop.available_balance,
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
  registerShop,
  updateShop,
  deleteShop,
  getShop,
  getShops,
  logoutShop,
};
