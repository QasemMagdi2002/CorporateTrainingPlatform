import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "../middleware/catchAsyncErros";
import ErrorHandler from "../utils/ErrorHandler";
import OrderModel, { IOrder } from "../models/order.model";
import userModel from "../models/user.models";
import CourseModel from "../models/course.model";
import path from "path";
import ejs from "ejs";
import sendMail from "../utils/sendMail";
import NotificationModel from "../models/notification.model";
import { getAllOrdersService, newOrder } from "../services/order.service";

// create order

export const createOrder = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { courseId, payment_info } = req.body as IOrder;

      const user = await userModel.findById(req.user?._id);

      const userHasCourse = user?.courses.find(
        (item: any) => item._id.toString() === courseId
      );

      if (userHasCourse) {
        return next(new ErrorHandler("you already own this course", 400));
      }
      const course = await CourseModel.findById(courseId);
      if (!course) {
        return next(new ErrorHandler("course doesnt exist", 404));
      }

      const courseData: any = {
        courseId: course._id,
        userId: user?._id,
        payment_info
      };


      const mailData = {
        order: {
          _id: course._id.toString().slice(0, 6),
          name: course.name,
          price: course.price,
          date: new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
      };
      const html = await ejs.renderFile(
        path.join(__dirname, "../mails/order-confirmation.ejs"),
        { order: mailData }
      );

      try {
        if (user) {
          await sendMail({
            email: user.email,
            subject: "Order confirmation",
            template: "order-confirmation.ejs",
            data: mailData,
          });
        }
      } catch (error: any) {
        return next(new ErrorHandler(error.message, 500));
      }
      user?.courses.push(course._id);
      await user?.save();

      await NotificationModel.create({
        user: user?._id,
        title: "New Order",
        message: `you have new order from ${course?.name}`,
      });

      course.purchased ? course.purchased+=1 : course.purchased;

      await course.save;
      newOrder(courseData, res, next);
      
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 500));
    }
  }
);

// get all orders --admin only


export const getAllOrders = CatchAsyncError(
  async (req:Request,res:Response,next:NextFunction) => {
    getAllOrdersService(res);
  }
)