import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the shop's name"],
    },
    email: {
      type: String,
      required: [true, "Please provide the shop's email address"],
      unique: [true, "Email address must be unique"],
      match: [/.+@.+\..+/, "Please provide a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    image: {
      type: String,
      required: [false], // Optional field
    },
    address: {
      type: String,
      required: [true, "Please provide the shop's address"],
    },
    phone_number: {
      type: Number,
      required: [true, "Please provide the shop's phone number"],
    },
    role: {
      type: String,
      enum: ["Seller", "Admin"], // Example roles
      default: "Seller",
    },
    avatar: {
      public_id: {
        type: String,
        required: [false], // Optional field
      },
      url: {
        type: String,
        required: [false], // Optional field
      },
    },
    zipcode: {
      type: Number,
      required: [true, "Please provide the shop's zipcode"],
    },
    withdraw_method: {
      type: Object,
      required: [false], // Optional field
      // Define the structure of this object if needed
    },
    available_balance: {
      type: Number,
      default: 0,
      min: [0, "Available balance cannot be negative"],
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically adds updatedAt field
  }
);

// Hash password before saving
shopSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10); // Salt rounds
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare provided password with hashed password
shopSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Shop = mongoose.model("Shop", shopSchema);

export default Shop;
