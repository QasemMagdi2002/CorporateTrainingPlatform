import { Response, Request, NextFunction } from 'express';
import express from 'express';
import { activateUser, LoginUser, registrationUser , logoutUser } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post("/login",LoginUser);

userRouter.get("/logout",logoutUser);

export default userRouter;