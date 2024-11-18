import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const createTask = createAsyncThunk("tasks/createTask", async (taskData, { rejectWithValue }) => {
    try {
        const response = await axios.post('/api/v1/users/tasks', taskData, {
            withCredentials: true,
        });
        return response.data.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message || 'failed to create task');
    }
});

const taskSlice = createSlice({
    name: "tasks",
    initialState: {
        tasks: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(createTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTask.fulfilled, (state, action) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export default taskSlice.reducer;