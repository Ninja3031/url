import express from 'express'
import { nanoid } from 'nanoid';
import dotenv from "dotenv"
import connectDB from './src/config/mongo.config.js';
import shortUrl from './src/routes/shortUrl.route.js';
import auth_routes from './src/routes/auth.route.js';
import user_routes from './src/routes/user.route.js';
import { redirectFromShortUrl } from './src/controller/shortUrl.controller.js';
import { errorHandler } from './src/utils/errorHandler.js';
import cors from 'cors'
import { attachUser } from "./src/utils/attachUser.js";
import cookieParser from "cookie-parser"

dotenv.config("./.env")

const app = express();

app.use(cors({
  origin: [
    "https://url-sigma-rosy.vercel.app", // your frontend's deployed URL
    "http://localhost:5173"              // (optional) for local dev
  ],
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(cookieParser())

app.use(attachUser)

app.use("/api/user" , user_routes)

app.use("/api/auth" , auth_routes)

app.use("/api/create" , shortUrl)

app.get("/:id" , redirectFromShortUrl)

app.use(errorHandler)

app.listen(3000 , () => {
    connectDB()
    console.log('Server is running at http://localhost:3000');
})
