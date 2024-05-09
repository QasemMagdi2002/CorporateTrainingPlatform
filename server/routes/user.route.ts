import { Response, Request, NextFunction } from 'express';
import express from 'express';
import { activateUser, LoginUser, registrationUser , logoutUser, updateAccessToken, getUserInfo, socialAuth, updateUserInfo, updatePassword, updateProfilePicture, getAllUsers, updateUserRole } from '../controllers/user.controller';
import { authorizeRole, isAuth } from '../middleware/auth';
const userRouter = express.Router();

userRouter.post('/registration', registrationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post("/login",LoginUser);

userRouter.get("/logout",isAuth,logoutUser);

userRouter.get("/refreshToken",updateAccessToken);

userRouter.get("/me",isAuth,getUserInfo);

userRouter.post("/social-auth",socialAuth);

userRouter.put("/update-user-info",isAuth,updateUserInfo);

userRouter.put("/update-user-password",isAuth,updatePassword);

userRouter.put("/update-user-avatar",isAuth,updateProfilePicture);

userRouter.get("/get-users",isAuth,authorizeRole("admin"),getAllUsers);

userRouter.put("/update-role",isAuth,authorizeRole("admin"),updateUserRole);

export default userRouter;