import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.models";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErros";
import jwt, { Secret } from "jsonwebtoken";
require("dotenv").config;
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
import { IUser } from "../models/user.models";
import { sendToken } from "../utils/jwt";
import { redis } from "../utils/redis";

// register error
interface IRegisterationBody {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const registrationUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password } = req.body;

      const iEmailExist = await userModel.findOne({ email });
      if (iEmailExist) {
        return next(new ErrorHandler("email already exists", 400));
      }

      const user: IRegisterationBody = {
        name,
        email,
        password,
      };

      const activationToken = createActivationToken(user);

      const activationCode = activationToken.activationCode;

      const data = { user: { name: user.name }, activationCode };

      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/activation-mail.ejs"),
        data
      );

      try {
        await sendMail({
          email: user.email,
          subject: "activate your account",
          template: "activation-mail.ejs",
          data,
        });
        res.status(201).json({
          succes: true,
          message: "please check your email to activate your account",
          activationToken: activationToken.token,
        });
      } catch (error: any) {
        return new ErrorHandler(error.message, 400);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

interface IActivationToken {
  token: string;
  activationCode: string;
}

export const createActivationToken = (user: any): IActivationToken => {
  const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

  const token = jwt.sign(
    {
      user,
      activationCode,
    },
    process.env.ACTIVATION_SECRET as Secret,
    { expiresIn: "5m" }
  );
  return { token, activationCode };
};

// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { activation_token, activation_code } =
        req.body as IActivationRequest;
      const newUser: { user: IUser; activationCode: string } = jwt.verify(
        activation_token,
        process.env.ACTIVATION_SECRET as string
      ) as { user: IUser; activationCode: string };

      if (newUser.activationCode !== activation_code) {
        return next(new ErrorHandler("invalid activation code", 400));
      }

      const { name, email, password } = newUser.user;

      const existUser = await userModel.findOne({ email });

      if (existUser) {
        return next(new ErrorHandler("Email already exists", 400));
      }

      const user = await userModel.create({
        name,
        email,
        password,
      });
      res.status(201).json({
        success: true,
      });
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

// login user

interface ILoginRequest {
  email: string;
  password: string;
}

export const LoginUser = CatchAsyncError(
  async (req: Request,res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body as ILoginRequest;
      if (!email || !password) {
        return next(new ErrorHandler("please enter email and password", 400));
      }

      const user = await userModel.findOne({email}).select("password");
      const Alluser = await userModel.findOne({email});
      
      if (!user) {
        return next(new ErrorHandler("invalid email or password", 400));
      }
      if (!Alluser) {
        return next(new ErrorHandler("invalid email or password", 400));
      }
      const isPasswordMatch = await user.comparePassword(password);

      if (!isPasswordMatch) {
        return next(new ErrorHandler("invalid email or password", 400));
      }

      sendToken(Alluser,200,res);

    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }

);

export const  logoutUser = CatchAsyncError( async (req:Request,res:Response,next:NextFunction) => {
  try 
  {
    res.cookie("access_token", "", {maxAge: 1})
    res.cookie("refresh_token", "", {maxAge: 1})
    const userId = req.user?._id || "";
    
    redis.del(userId)

    res.status(200).json({
      success:true,
      message: "logged out"
    })
    
  }
  catch(error:any)
  {
    return next(new ErrorHandler(error.message,400))
  }
})