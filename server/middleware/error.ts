import { Response,Request,NextFunction } from 'express';
import ErrorHandler from '../utils/ErrorHandler'

export const ErrorMiddleware = (
    err:any,
    req:Request,
    res:Response,
    next:NextFunction
    ) =>{     
    err.statusCode= err.statusCode || 500;
    err.message = err.message || "internal server error";

    //wrong db id
    if (err.name === "CastError" ){
        const message = `Resource not found in ${err.path}`;
        err = new ErrorHandler(message,400);
    }
    //duplicate key error
    if (err.code === 1100 ){
        const message = `Duplicate ${Object.keys(err.Keyvalue)} entered`;
        err = new ErrorHandler(message,400);
    }
    //wrong jwt error
    if (err.name === "JsonWebTokenError" ){
        const message = `json web token invalid, try again`;
        err = new ErrorHandler(message,400);
    }
    //jwt expired error
    if (err.name === "JsonWebTokenError" ){
        const message = `json web token Expired, try again`;
        err = new ErrorHandler(message,400);
    }
    res.status(err.statusCode).json(
    {
        success:false,
        message:err.message
    });
}