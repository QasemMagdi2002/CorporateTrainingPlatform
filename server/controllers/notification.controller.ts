import NotificationModel from "../models/notification.model";
import { Request,Response,NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErros";
import ErrorHandler from "../utils/ErrorHandler";


// get all notifications --only admin
export const getNotifications = CatchAsyncError(async (req:Request,res:Response,next:NextFunction) => {
    try{
        const notifications = await NotificationModel.find().sort({createdAt: -1});

        res.status(201).json({
            success:true,
            notifications
        })
    }
    catch(error:any){
        return next(new ErrorHandler(error.message,500));
    }
})