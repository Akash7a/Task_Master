import {Board} from "../models/board.models.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createBoard = AsyncHandler(async (req, res) => {
    const { title, description } = req.body;
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(400, "User does not exist. Please login to continue.");
    }

    if (!title || !description) {
        throw new ApiError(400, "Title and description are required.");
    }

    const board = new Board({
        title,
        description,
        owner: userId,
        members: [userId],
    });

    await board.save();
    res.status(201).json(new ApiResponse(201, board, "Board created successfully."));
});

const getBoards = AsyncHandler(async (req, res) => {
    const userId = req.user.id;

    if (!userId) {
        throw new ApiError(400, "User does not exist. Please login.");
    }

    const boards = await Board.find({
        $or: [{ owner: userId }, { members: userId }]
    });

    res.status(200).json(new ApiResponse(200, boards, "All boards fetched successfully."));
});

const getOneBoard = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const board = await Board.findById(id).populate('members', 'username email');

    if (!board) {
        throw new ApiError(404, "Board not found.");
    }

    res.status(200).json(new ApiResponse(200, board, "Board fetched successfully."));
});

const updateBoard = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    const updatedBoard = await Board.findByIdAndUpdate(
        id,
        { title, description },
        { new: true, runValidators: true },
    );

    if (!updatedBoard) {
        throw new ApiError(404, "Board not found.");
    }

    res.status(200).json(new ApiResponse(200, updatedBoard, "Board updated successfully."));
});

const deleteBoard = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const board = await Board.findOneAndDelete({ _id: id, owner: userId });

    if (!board) {
        throw new ApiError(404, "Board not found or unauthorized.");
    }

    res.status(200).json(new ApiResponse(200, null, "Board deleted successfully."));
});

export {
    createBoard,
    getBoards,
    getOneBoard,
    updateBoard,
    deleteBoard,
};