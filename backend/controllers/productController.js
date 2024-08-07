import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

//@desc    Fetch all products
//@route   GET /api/products
//@access  Public
const getProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

//@desc    Create products
//@route   POST /api/products
//@access  Private
const createProduct = asyncHandler(async (req, res) => {
  const { name, brand, price, description, category } = req.body;

  const productExist = await Product.findOne({ name });
  if (productExist) {
    res.status(400);
    throw new Error("Product already exists");
  }
  const product = await Product.create({
    name,
    brand,
    price,
    description,
    category,
  });
  if (product) {
    res.status(200).json({
      _id: product._id,
      name: product.name,
      brand: product.brand,
      price: product.price,
      description: product.description,
      category: product.category,
    });
  } else {
    res.status(400);
    throw new Error("Invalid product data");
  }
});

//@desc    Delete products
//@route   DELETE /api/products/:id
//@access  Private
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

//@desc    Update products
//@route   PUT /api/products/:id
//@access  Private
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (product) {
    product.name = req.body.name || product.name;
    product.brand = req.body.brand || product.brand;
    product.price = req.body.price || product.price;
    product.description = req.body.description || product.description;
    product.category = req.body.category || product.category;
    const updatedProduct = await product.save();
    res.json({
      _id: updatedProduct._id,
      name: updatedProduct.name,
      brand: updatedProduct.brand,
      price: updatedProduct.price,
      description: updatedProduct.description,
      category: updatedProduct.category,
    });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});
export { getProduct, createProduct, deleteProduct, updateProduct };
