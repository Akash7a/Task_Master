import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.models.js";


// Set secure cookies for tokens
const options = {
    httpOnly: true,
    secure: false, //process.env.NODE_ENV === "production",
    sameSite: "Strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

const registerUser = AsyncHandler(async (req, res) => {
    const { username, email, password, role } = req.body; // extract the user details

    // validating
    if ([username, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "username , email and password are required.");
    };

    //  if user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
        throw new ApiError(409, "User with given email or username already exists");
    };

    console.log(req.body);

    const user = new User({
        username,
        email,
        password,
        role: role || "User"
    });
    await user.save();

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    res.status(201)
        .json(
            new ApiResponse(201, createdUser, "User registered Successfully.",)
        );

});
const loginUser = AsyncHandler(async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    if (!usernameOrEmail || !password) {
        throw new ApiError(400, "Username/Email and Password are required");
    }

    // Find user by email or username
    const user = await User.findOne({
        $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });

    if (!user) {
        throw new ApiError(400, "User does not exist");
    }

    // Check if the password is correct
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new ApiError(400, "Password is not valid");
    }

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save();


    // User data to send in the response
    const userData = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
    };


    res.cookie("accessToken", accessToken, options);
    res.cookie("refreshToken", refreshToken, options);

    return res.status(200).json(
        new ApiResponse(200, { userData, accessToken, refreshToken }, "User logged in successfully")
    );
});
const logoutUser = AsyncHandler(async (req, res) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");

    return res.status(200).json(
        new ApiResponse(200, null, "User logged out successfully")
    )
});
export {
    registerUser,
    loginUser,
    logoutUser,
}