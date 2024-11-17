import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    loading: false,
    error: null,
    success: false,
};

// Register user
export const registerUser = createAsyncThunk(
    "auth/registerUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:5000/api/v1/users/register", userData, {
                withCredentials: true,  // Send cookies with the request
            });
            return response.data;
        } catch (error) {
            console.error('Request failed:', error);
            return rejectWithValue(error.response?.data?.message || "Something went wrong");
        }
    }
);

// Login user
export const loginUser = createAsyncThunk(
    "auth/loginUser",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post("http://localhost:5000/api/v1/users/login", userData, {
                withCredentials: true,  // Send cookies with the request
            });
            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message || error.message || "Something went wrong"
            );
        }
    }
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async (_, { rejectWithValue }) => {
    try {
        await axios.post("http://localhost:5000/api/v1/users/logout", {}, { withCredentials: true });
        return;   
    } catch (error) {
        return rejectWithValue("Logout failed");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError(state) {
            state.error = null;
        },
        clearSuccess(state) {
            state.success = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Register user
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.status = "loading";
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.success = true;
                state.status = "succeeded";
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });

        // Login user
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.status = "loading";
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload;
                state.success = true;
                state.status = "succeeded";
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.success = false;
            });

        // Logout user
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null; // Clear user data from state
                state.success = false;
                state.status = "succeeded";
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.payload;
                state.success = false;
            });
    }
});

export const { clearError, clearSuccess } = authSlice.actions;

export default authSlice.reducer;