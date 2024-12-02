import { Router } from "express";
import { registerUser, loginUser, logoutUser,refreshAccessToken } from "../controllers/users.controller.js";
import protect from "../middleware/verifyJWT.middleware.js";

const userRouter = Router();

// Authentication routes
userRouter.route("/register").post(registerUser);
userRouter.route("/login").post(loginUser);
userRouter.route("/logout").post(protect, logoutUser);
userRouter.route("/refresh-token").post(refreshAccessToken);

export default userRouter;