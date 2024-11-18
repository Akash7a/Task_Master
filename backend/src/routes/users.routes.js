import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/users.controller.js";
import { createTask, getAllTasks } from "../controllers/tasks.controller.js";
import protect from "../middleware/verifyJWT.middleware.js";

const router = Router();

// authentication routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(protect, logoutUser);

// task routes
router.route("/tasks").post(protect, createTask);
router.route("/tasks").get(protect,getAllTasks);

export default router;
