import { Response, Request, NextFunction } from 'express';
import express from 'express';
import { activateUser, LoginUser, registrationUser , logoutUser } from '../controllers/user.controller';
import { isAuth } from '../middleware/auth';

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post("/login",LoginUser);

userRouter.get("/logout",isAuth,logoutUser);

export default userRouter;