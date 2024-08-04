import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    // phoneNumber:{
    //   type: Number,
    // },
    // addresses:[
    //   {
    //     country: {
    //       type: String,
    //     },
    //     city:{
    //       type: String,
    //     },
    //     address1:{
    //       type: String,
    //     },
    //     address2:{
    //       type: String,
    //     },
    //     zipCode:{
    //       type: Number,
    //     },
    //     addressType:{
    //       type: String,
    //     },
    //   }
    // ],
    // role:{
    //   type: String,
    //   default: "user",
    // },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // this check if the password on the frontend when you update the password is the same as the one you entered before update it will not do anything to the password
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
