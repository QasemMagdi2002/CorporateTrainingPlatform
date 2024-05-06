import express from "express";
import { uploadCourse } from "../controllers/course.controller";
import { authorizeRole, isAuth } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuth,
  authorizeRole("admin"),
  uploadCourse
);

export default courseRouter;