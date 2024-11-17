import { AsyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/users.models.js";

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;

        await user.save({ validateBeforeSave: false });
        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(500, "something went wrong while generating refresh and access token");
    }
}
// Set secure cookies for tokens
const options = {
    httpOnly: true,
    secure: false, //process.env.NODE_ENV === "production",
    sameSite: "Strict",
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


    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        );

});
const logoutUser = AsyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1,
            },
        }
        , {
            new: true
        }
    );

    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "user logged out"));

});
export {
    registerUser,
    loginUser,
    logoutUser,
}