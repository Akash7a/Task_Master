import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import multer from "multer";

dotenv.config({
    path: "../.env",
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const upload = multer();

app.use(upload.none());

import userRouter from "./routes/users.routes.js";
app.use("/api/v1/users", userRouter);

export default app;
