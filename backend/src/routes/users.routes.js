import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/users.controller.js";
import protect from "../middleware/verifyJWT.middleware.js";

const userRouter = Router();

// Authentication routes
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(protect, logoutUser);

export default userRouter;