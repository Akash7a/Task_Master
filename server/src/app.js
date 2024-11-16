import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import multer from "multer";
import cookieParser from "cookie-parser";

dotenv.config({
    path: "../.env",
});

const app = express();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const upload = multer();

app.use(upload.none());

import userRouter from "./routes/users.routes.js";
app.use("/api/v1/users", userRouter);

export default app;
