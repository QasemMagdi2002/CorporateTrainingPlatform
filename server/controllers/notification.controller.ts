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


// update notification status -- only admin
export const updateNotifications = CatchAsyncError(async (req:Request,res:Response,next:NextFunction) => {
    try{
       const notification = await NotificationModel.findById(req.params.id);
       if(!notification){
        return next(new ErrorHandler("couldnt find notification",404));
       }
       else{
       notification.status ? 
       (notification.status = "read") 
       : notification.status;
       await notification.save();
    }

       const notifications = await NotificationModel.find().sort({createdAt:-1});
       res.status(201).json({
        success:true,
        notifications
       })
    }
    catch(error:any){
        return next(new ErrorHandler(error.message,500));
    }
})