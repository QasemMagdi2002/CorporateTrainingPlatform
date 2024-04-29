import express, {Request, NextFunction ,Response} from "express";
export const app = express();
import cors from "cors"
import cookieparser from 'cookie-parser'
require("dotenv").config
import { ErrorMiddleware } from "./middleware/error";
app.use(express.json({limit:"50mb"}));

app.use(cookieparser());

app.use(cors(
    {
        origin: process.env.ORIGIN
    })
);

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
