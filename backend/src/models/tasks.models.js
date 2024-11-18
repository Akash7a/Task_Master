import mongoose, { Schema, model } from "mongoose";

const taskSchema = new Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        priority: {
            type: String,
            enum: ["High", "Medium", "Low"],
            default: "Medium",
        },
        status: {
            type: String,
            enum: ["Pending", "Completed"],
            default: "Pending",
        },
        dueDate: {
            type: Date,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        }
    },
    {
        timestamps: true,
    }
);

export const Task = model("Task", taskSchema);