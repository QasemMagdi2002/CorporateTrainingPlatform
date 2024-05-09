import express from "express";
import { authorizeRole, isAuth } from "../middleware/auth";
import { getNotifications, updateNotifications } from "../controllers/notification.controller";
const notificationRouter = express.Router();

notificationRouter.get("/get-notifications",isAuth,authorizeRole("admin"),getNotifications);

notificationRouter.put("/read-notification/:id/",isAuth,authorizeRole("admin"),updateNotifications);

export default notificationRouter;