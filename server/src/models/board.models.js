import mongoose, { Schema } from "mongoose";

const boardSchema = Schema(
    {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            }
        ],
    },
    {
        timestamps: true,
    }
);

export const Board = mongoose.model("Board", boardSchema);