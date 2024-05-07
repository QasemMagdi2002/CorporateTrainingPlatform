import express from "express";
import { editCourse, getAllCourses, getaSingleCourse, getCourseByUser, uploadCourse } from "../controllers/course.controller";
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
  getaSingleCourse
);

courseRouter.get(
  "/get-courses/",
  getAllCourses
);

courseRouter.get(
  "/get-course-content/:id",
  isAuth,
  getCourseByUser
);

export default courseRouter;