import { Router } from "express";
import protect from "../middleware/verifyJWT.middleware.js";
import {
    createTask,
    getAllTasks,
    yourTasks,
    deleteTasks,
    updateTask,
} from "../controllers/tasks.controller.js";

const taskRouter = Router();

// Task routes
taskRouter.route("/createTask").post(protect, createTask);
taskRouter.route("/getAllTasks").get(protect, getAllTasks);
taskRouter.route("/getYourTasks").get(protect, yourTasks);
taskRouter.route("/deleteTask/:taskId").delete(protect, deleteTasks);
taskRouter.route("/updateTask/:taskId").put(protect,updateTask);

export default taskRouter;