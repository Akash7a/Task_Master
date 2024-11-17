import jwt from "jsonwebtoken";
import { User } from "../models/users.models.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import dotenv from "dotenv";

dotenv.config({
    path: "../.env"
});

const protect = AsyncHandler(async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const userId = decodedToken.id;  
        const user = await User.findById(userId).select("-password -refreshToken");

        if (!user) {
            throw new ApiError(401, "Invalid Access Token");
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        throw new ApiError(401, error?.message || "Invalid Access Token");
    }
});


export default protect;