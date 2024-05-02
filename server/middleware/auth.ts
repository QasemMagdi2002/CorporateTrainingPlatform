import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErros";
import ErrorHandler from "../utils/ErrorHandler";
import  jwt, { JwtPayload }  from "jsonwebtoken";
import { redis } from "../utils/redis";
require("dotenv").config
export const isAuth = CatchAsyncError(
    async (req:Request,res:Response, next:NextFunction) => 
        {
            const access_token = req.cookies.access_token;
            if (!access_token)
            {
                return next(new ErrorHandler("please login",400));
            }
            const decoded = jwt.verify(access_token,process.env.ACCESS_TOKEN as string) as JwtPayload; 
            
            if(!decoded)
            {
                return next(new ErrorHandler("Access token not valid",400));
            }

            const user = await redis.get(decoded.id);

            if(!user)
            {
                return next(new ErrorHandler("user not found",400))
            }

            req.user = JSON.parse(user);

            next();
})