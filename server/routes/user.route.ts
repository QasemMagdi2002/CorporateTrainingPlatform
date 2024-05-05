import { Response, Request, NextFunction } from 'express';
import express from 'express';
import { activateUser, LoginUser, registrationUser , logoutUser, updateAccessToken, getUserInfo } from '../controllers/user.controller';
import { authorizeRole, isAuth } from '../middleware/auth';

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post("/login",LoginUser);

userRouter.get("/logout",isAuth,logoutUser);

userRouter.get("/refreshToken",updateAccessToken);

userRouter.get("/me",isAuth,getUserInfo);
export default userRouter;