import express from "express";
export const app = express();
import cors from "cors"
import cookieparser from 'cookie-parser'
require("dotenv").config
app.use(express.json({limit:"50mb"}));

app.use(cookieparser());

app.use(cors(
    {
        origin: process.env.ORIGIN
    })
);

