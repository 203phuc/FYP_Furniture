import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

//@desc    Fetch all products
//@route   GET /api/products
//@access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@desc    Create a new product
//@route   POST /api/products
//@access  Private
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    stock_quantity,
    category,
    roomtype,
    images,
    specifications,
  } = req.body;

  const productExist = await Product.findOne({ name });
  if (productExist) {
    res.status(400);
    throw new Error("Product already exists");
  }

  const product = new Product({
    name,
    description,
    price,
    stock_quantity,
    category,
    roomtype,
    images,
    specifications,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

//@desc    Delete a product
//@route   DELETE /api/products/:id
//@access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc    Update a product
//@route   PUT /api/products/:id
//@access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    stock_quantity,
    category,
    roomtype,
    images,
    specifications,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock_quantity = stock_quantity || product.stock_quantity;
    product.category = category || product.category;
    product.roomtype = roomtype || product.roomtype;
    product.images = images || product.images;
    product.specifications = specifications || product.specifications;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export { getProducts, createProduct, deleteProduct, updateProduct };
