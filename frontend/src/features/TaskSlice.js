import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    tasks: [],
    success: false,
    error: null,
    loading: false,
    message: null,
};

export const createTasks = createAsyncThunk(
    "task/createTask",
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://localhost:5000/api/v1/tasks/createTask",
                userData,
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const getAllTasks = createAsyncThunk("tasks/getAllTasks", async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get("http://localhost:5000/api/v1/tasks/getYourTasks", { withCredentials: true });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const deleteTasks = createAsyncThunk("tasks/deleteTasks", async (taskId, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`http://localhost:5000/api/v1/tasks/deleteTask/${taskId}`, { withCredentials: true });
        return { taskId, message: response.data?.message };
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
})

export const updateTasks = createAsyncThunk("tasks/updateTasks", async ({ taskId, taskData }, { rejectWithValue }) => {
    try {
        const response = await axios.put(
            `http://localhost:5000/api/v1/tasks/updateTask/${taskId}`,
            taskData,
            { withCredentials: true }
        );
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

export const toggleTask = createAsyncThunk("tasks/toggleTasks", async ({ taskId }, { rejectWithValue }) => {
    try {
        const response = await axios.put(`http://localhost:5000/api/v1/tasks/toggleTask/${taskId}`, {}, { withCredentials: true });
        console.log(response.data);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message);
    }
});

const TaskSlice = createSlice({
    name: "Tasks",
    initialState,
    reducers: {
        clearSuccess: (state) => {
            state.success = false;
            state.message = null;
        },
        clearError: (state) => {
            state.error = null;
            state.message = null;
        },
        resetMessage: (state) => {
            state.message = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createTasks.pending, (state) => {
                state.loading = true;
                state.message = null;
            })
            .addCase(createTasks.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Task created successfully"; // Ensure message is string
                state.tasks.push(action.payload);
            })
            .addCase(createTasks.rejected, (state, action) => {
                state.error = action.payload;
                state.success = false;
                state.message = action.payload?.message || "An error occurred";
                state.loading = false;
            });

        builder
            .addCase(getAllTasks.pending, (state) => {
                state.loading = true;
                state.message = null;
            })
            .addCase(getAllTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
                state.message = action.payload?.message || "Tasks loaded successfully";
                state.tasks = action.payload?.data || []; // Ensure tasks is an array
            })
            .addCase(getAllTasks.rejected, (state, action) => {
                state.error = action.payload;
                state.success = false;
                state.message = action.payload?.message || "Failed to fetch tasks";
                state.loading = false;
            });

        builder
            .addCase(deleteTasks.pending, (state) => {
                state.loading = true;
                state.message = null;
            })
            .addCase(deleteTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.success = true;
                state.message = action.payload?.message || "Task deleted successfully";
                state.tasks = state.tasks.filter((task) => task._id !== action.payload?.taskId);
            })
            .addCase(deleteTasks.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
            });

        builder
            .addCase(updateTasks.pending, (state) => {
                state.loading = true;
                state.message = null;
            })
            .addCase(updateTasks.fulfilled, (state, action) => {
                state.error = null;
                state.loading = false;
                state.success = true;
                state.message = action.payload?.message || "Task updated successfully";
                const updatedTask = action.payload?.data;
                const index = state.tasks.findIndex((task) => task._id === updatedTask?._id);
                if (index !== -1) {
                    state.tasks[index] = updatedTask;
                }
            })
            .addCase(updateTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.message = action.payload;
            });

        builder
            .addCase(toggleTask.pending, (state) => {
                state.loading = true;
                state.message = null;
            })
            .addCase(toggleTask.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.message = action.payload?.message || "Task status toggled successfully";
                state.success = true;

                const toggledTask = action.payload?.data;
                const index = state.tasks.findIndex((task) => task._id === toggledTask?._id);
                if (index !== -1) {
                    state.tasks[index] = toggledTask;
                }
            })
            .addCase(toggleTask.rejected, (state, action) => {
                state.loading = false;
                state.success = false;
                state.error = action.payload;
                state.message = action.payload || "Failed to toggle task status.";
            });
    }
});

export const { clearSuccess, clearError, resetMessage } = TaskSlice.actions;
export default TaskSlice.reducer;