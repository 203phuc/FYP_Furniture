import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email address"],
      unique: [true, "Email address must be unique"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
    },
    phoneNumber: {
      type: Number,
      required: [false], // Optional field
    },
    addresses: [
      {
        country: {
          type: String,
          required: [true, "Please provide the country for the address"],
        },
        city: {
          type: String,
          required: [true, "Please provide the city for the address"],
        },
        address1: {
          type: String,
          required: [
            true,
            "Please provide the primary address line (address1)",
          ],
        },
        address2: {
          type: String,
          required: [false], // Optional field
        },
        zipCode: {
          type: Number,
          required: [true, "Please provide the zipcode for the address"],
        },
        addressType: {
          type: String,
          enum: ["home", "work", "other"], // Example address types
          required: [
            true,
            "Please specify the type of address (home, work, other)",
          ],
        },
      },
    ],
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin"], // Example roles
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10); // 10 is salt round
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
