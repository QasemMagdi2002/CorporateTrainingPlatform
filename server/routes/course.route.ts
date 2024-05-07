import express from "express";
import { editCourse, getAllCourses, getaSingleCourse, uploadCourse } from "../controllers/course.controller";
import { authorizeRole, isAuth } from "../middleware/auth";
const courseRouter = express.Router();

courseRouter.post(
  "/create-course",
  isAuth,
  authorizeRole("admin"),
  uploadCourse
);

courseRouter.put(
  "/edit-course/:id",
  isAuth,
  authorizeRole("admin"),
  editCourse
);

courseRouter.get(
  "/get-course/:id",
  isAuth,
  getaSingleCourse
);

courseRouter.get(
  "/get-courses/",
  isAuth,
  getAllCourses
);

export default courseRouter;