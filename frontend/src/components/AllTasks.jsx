import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllTasks } from "../features/TaskSlice.js";

const AllTasks = () => {
    const dispatch = useDispatch();
    const { tasks, loading, error } = useSelector((state) => state.tasks);

    useEffect(() => {
        dispatch(fetchAllTasks());
    }, [dispatch]);

    if (loading) {
        return <div className="text-center mt-8 text-blue-500 font-semibold">Loading tasks...</div>;
    }

    if (error) {
        return <div className="text-center mt-8 text-red-500 font-semibold">Error: {error}</div>;
    }

    if (!Array.isArray(tasks)) {
        return <div className="text-center mt-8 text-red-500 font-semibold">Error: Invalid tasks data</div>;
    }

    return (
        <div className="bg-gray-100 min-h-screen py-8 px-4">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">All Tasks</h1>
            {tasks.length === 0 ? (
                <p className="text-center text-gray-600">No tasks available</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="bg-white shadow-md rounded-lg p-6 border border-gray-200"
                        >
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">{task.title}</h3>
                            <p className="text-gray-600 mb-2">{task.description}</p>
                            <div className="text-sm text-gray-500">
                                <p>
                                    <span className="font-medium text-gray-800">Priority:</span> {task.priority}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-800">Due Date:</span>{" "}
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-800">Owner:</span> {task.owner?.username || "Unknown"}
                                </p>
                            </div>
                            <div className="mt-4">
                                <button className="w-full text-white bg-blue-500 hover:bg-blue-600 rounded-md py-2">
                                    View Task
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllTasks;