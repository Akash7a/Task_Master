import { Task } from "../models/tasks.models.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.models.js";

const createTask = AsyncHandler(async (req, res) => {
    const { title, description, priority, dueDate } = req.body;

    if ([title, description, priority, dueDate].some(fields => !fields)) {
        throw new ApiError(400, "Title ,description , and dueDate are required.");
    }

    // accessing authenticated user
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(401, "User is not authenticated.");
    }

    // Normalize the priority value (first letter uppercase)
    const validPriority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();

    // Create new task with corrected "owner" and priority
    const newTask = await Task.create(
        {
            title,
            description,
            priority: validPriority,
            dueDate,
            owner: userId,
        }
    );

    await User.findOneAndUpdate(
        { _id: userId },
        { $push: { allTasksCreated: newTask._id }, },
        { new: true },
    );

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                "Task created successfully",
                newTask,
            )
        );
});

const getAllTasks = AsyncHandler(async (req, res) => {
    const tasks = await Task.find({})
        .populate("owner", "username email role")
        .exec();

    if (!tasks || tasks.length === 0) {
        throw new ApiError(404, "No tasks found.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tasks,
                "Tasks fetched successfully",
            )
        );
});
export {
    createTask,
    getAllTasks,
}