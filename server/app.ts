import express, {Request, NextFunction ,Response} from "express";
export const app = express();
import cors from "cors"
import cookieparser from 'cookie-parser'
require("dotenv").config
import { ErrorMiddleware } from "./middleware/error";
import userRouter from "./routes/user.route";
import courseRouter from "./routes/course.route";
import orderRouter from "./routes/order.route";
import notificationRouter from "./routes/notifications.route";
app.use(express.json( { limit:"100mb" }));

app.use(cookieparser());

express.urlencoded({ extended: true })

app.use(cors(
    {
        origin: process.env.ORIGIN
    })
);

//routes 

app.use("/api/v1",userRouter,courseRouter,orderRouter,notificationRouter);


app.get("/test", (req:Request, res:Response,next:NextFunction)=>{
    res.status(200).json(
        {
            success:true,
            message:"api is working"
        });
})

app.all("*", (req:Request,res:Response,next:NextFunction) =>
    {
        const err = new Error(`Route ${req.originalUrl} not found`) as any;
        err.statusCode = 404;
        next(err);
    } )

app.use(ErrorMiddleware);
