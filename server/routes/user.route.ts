import { Response, Request, NextFunction } from 'express';
import express from 'express';
import { activateUser, LoginUser, registrationUser } from '../controllers/user.controller';

const userRouter = express.Router();

userRouter.post('/registration', registrationUser);

userRouter.post('/activate-user', activateUser);

userRouter.post("/login",LoginUser);
export default userRouter;