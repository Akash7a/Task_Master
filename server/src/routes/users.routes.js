import { Router } from "express";
import { registerUser, loginUser, logoutUser } from "../controllers/users.controllser.js";
import { createBoard, getBoards, getOneBoard, deleteBoard, updateBoard } from "../controllers/boards.controllers.js";
import protect from "../middleware/verifyJWT.middleware.js";

const router = Router();

// authentication routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(protect, logoutUser);

// boards routes
router.route("/boards").post(protect, createBoard);
router.route("/boards").get(protect, getBoards);
router.route("/boards/:id").get(protect, getOneBoard);
router.route("/boards/:id").delete(protect, deleteBoard);
router.route("/boards/:id").put(protect, updateBoard);

export default router;
