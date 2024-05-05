import { model, Schema, Document, Model } from "mongoose";
import mongoose from "mongoose";
import bycrypt from "bcryptjs";
require("dotenv").config
import jwt from "jsonwebtoken"
const emailRegexPattern: RegExp = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/;

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  avatar: {
    public_id: string;
    url: string;
  };
  role: string;
  isVerified: boolean;
  courses: Array<{ courseId: string }>;
  comparePassword: (password: string) => Promise<boolean>;
  SignAccessToken: () => string;
  SignRefreshToken: () => string;
}

const userSchema: Schema<IUser> = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please enter your name"],
    },
    email: {
      type: String,
      required: [true, "please enter your email"],
      validate: {
        validator: function (value: string) {
          return emailRegexPattern.test(value);
        },
        message: "enter a valid email",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "please enter your password"],
      minlength: [6, "password must be atleast 6 characters long"],
      select: false,
    },
    avatar: {
      public_id: String,
      url: String,
    },
    role: {
      type: String,
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    courses: [
      {
        courseId: String,
      },
    ],
  },
  { timestamps: true }
);

// hash password

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bycrypt.hash(this.password, 10);
  next();
});

// sign access token
userSchema.methods.SignAccessToken = function()
{
  return jwt.sign({id:this._id},process.env.ACCESS_TOKEN || '',{expiresIn:'5m'});
}

// sign refresh token
userSchema.methods.SignRefreshToken = function ()
{
  return jwt.sign({id:this._id},process.env.REFRESH_TOKEN || '',{expiresIn:"3d"})
}

// compare password

userSchema.methods.comparePassword = async function (
  enteredPassword: string
): Promise<boolean> {
  return await bycrypt.compare(enteredPassword, this.password);
};
const userModel: Model<IUser> = mongoose.model("User", userSchema);

export default userModel;
