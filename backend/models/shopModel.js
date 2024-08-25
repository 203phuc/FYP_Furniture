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
      required: false, // Optional field
    },
    address: {
      type: String,
      required: [true, "Please provide the shop's address"],
    },
    phoneNumber: {
      type: Number,
      required: [true, "Please provide the shop's phone number"],
      min: [0, "Phone number cannot be negative"],
    },
    role: {
      type: String,
      enum: ["Seller", "Admin"], // Example roles
      default: "Seller",
    },
    avatar: {
      publicId: {
        type: String,
        required: false, // Optional field
      },
      url: {
        type: String,
        required: false, // Optional field
      },
    },
    zipCode: {
      type: Number,
      required: [true, "Please provide the shop's zipcode"],
    },
    withdrawMethod: {
      type: Object,
      required: false, // Optional field
      // Define the structure of this object if needed
    },
    availableBalance: {
      type: Number,
      default: 0,
      min: [0, "Available balance cannot be negative"],
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
