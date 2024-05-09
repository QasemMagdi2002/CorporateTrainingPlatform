import express from "express";
import { authorizeRole, isAuth } from "../middleware/auth";
import { getNotifications } from "../controllers/notification.controller";
const notificationRouter = express.Router();

notificationRouter.get("/get-notifications",isAuth,authorizeRole("admin"),getNotifications);

export default notificationRouter;