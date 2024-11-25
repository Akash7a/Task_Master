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

    const validPriority = priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();

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
                newTask,
                "Task created successfully",
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

const yourTasks = AsyncHandler(async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(401, "User is not authenticated.");
    }

    const tasks = await Task.find({ owner: userId })
        .populate("owner", "username email role")
        .exec();

    if (!tasks || tasks.length === 0) {
        throw new ApiError(404, "No tasks found for the user.");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                tasks,
                "User's tasks fetched successfully."
            )
        );
});

const updateTask = AsyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { taskId } = req.params;
    const { title, description, priority, dueDate } = req.body;

    if (!userId) {
        throw new ApiError(401, "User is not authenticated.");
    }

    if (!taskId) {
        throw new ApiError(400, "Task ID is required.");
    }

    const task = await Task.findOne({ _id: taskId, owner: userId });

    if (!task) {
        throw new ApiError(400, "Task not found or you are not authorized to update it.");
    }

    const validPriority = priority ? priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase() : task.priority;

    let parsedDueDate;
    if (dueDate) {
        parsedDueDate = new Date(dueDate);
        if (isNaN(parsedDueDate)) {
            throw new ApiError(400, "Invalid dueDate format. Must be a valid date.");
        }
    }

    const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
            title: title || task.title,
            description: description || task.description,
            priority: validPriority,
            dueDate: parsedDueDate || task.dueDate,
        },
        {
            new: true,
            runValidators: true,
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedTask,
                "Task updated successfully."
            )
        );
});

const deleteTasks = AsyncHandler(async (req, res) => {
    const userId = req.user.id;
    const { taskId } = req.params;

    if (!userId) {
        throw new ApiError(401, "User is not authenticated.");
    }

    if (!taskId) {
        throw new ApiError(400, "Task ID is required.");
    }

    const task = await Task.findOne({ _id: taskId, owner: userId });

    if (!task) {
        throw new ApiError(404, "Task not found or you are not authorized to delete it.");
    }

    await Task.findByIdAndDelete(taskId);

    await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { allTasksCreated: taskId } },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                null,
                "Task delete successfully.",
            )
        );
});

export {
    createTask,
    getAllTasks,
    yourTasks,
    deleteTasks,
    updateTask,
}