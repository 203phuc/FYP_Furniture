const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const shopSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      default: "Seller",
    },
    //   avatar: {
    //     public_id: {
    //       type: String,
    //       required: true,
    //     },
    //     url: {
    //       type: String,
    //       required: true,
    //     },
    //   },
    zipCode: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

// Hash password
shopSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10); // 10 is salt round
  this.password = await bcrypt.hash(this.password, salt);
});

// comapre password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const Shop = mongoose.model("Shop", shopSchema);

module.exports = Shop;
