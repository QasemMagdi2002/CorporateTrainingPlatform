import { Server, setMaxIdleHTTPParsers } from 'http';
import {app} from './app';
import connectDB from './utils/db';
require("dotenv").config();


// create server 
 app.listen(process.env.PORT, ()=>
    {
        console.log(`server is running at ${process.env.PORT}`);
        connectDB();
    })
