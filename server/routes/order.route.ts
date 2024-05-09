import express from "express";
import { authorizeRole, isAuth } from "../middleware/auth";
import { createOrder } from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order", isAuth, createOrder);

export default orderRouter;
