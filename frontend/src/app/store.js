import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/AuthSlice.js";
import taskReducer from "../features/TaskSlice.js";

const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks:taskReducer,
    }
});
export default store;