import { Request, Response, NextFunction } from "express";
import userModel from "../models/user.models";
import ErrorHandler from "../utils/ErrorHandler";
import { CatchAsyncError } from "../middleware/catchAsyncErros";
import jwt, { Secret } from "jsonwebtoken";
require("dotenv").config;
import ejs from "ejs";
import path from "path";
import sendMail from "../utils/sendMail";
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
        res.status(200).json({
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

interface IActivationToken {
  token: string;
  activationCode: string;
}
