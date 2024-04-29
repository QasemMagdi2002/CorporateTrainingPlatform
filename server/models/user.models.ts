import { model, Schema ,Document} from "mongoose";
import mongoose from "mongoose";
import bycrypt from 'bcryptjs';

const emailRegexPattern :RegExp = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/

export interface IUser extends Document
{
    name:string,
    email:string,
    password:string,
    avatar:
    {
        public_id:string,
        url:string
    },
    role:string,
    isVerified:boolean,
    
}