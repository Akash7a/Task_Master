import mongoose, { Mongoose, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config({
    path: "../.env",
});

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            index: true,
            trim: true,
            lowercase: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["User", "Admin"],
            default: "User",
        },
        allTasksCreated: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task",
            }],
        refreshToken: {
            type: String,
        }
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" },
    )
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "10d" }
    )
}
export const User = mongoose.model("User", userSchema);