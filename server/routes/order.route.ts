import express from "express";
import { authorizeRole, isAuth } from "../middleware/auth";
import { createOrder, getAllOrders } from "../controllers/order.controller";
const orderRouter = express.Router();

orderRouter.post("/create-order", isAuth, createOrder);


orderRouter.get(
    "/get-orders-admin",
    isAuth,
    authorizeRole("admin"),
    getAllOrders
  );

export default orderRouter;
