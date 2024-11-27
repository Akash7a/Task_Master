import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteTasks, getAllTasks, updateTasks } from "../features/TaskSlice.js";

const TaskList = () => {
    const dispatch = useDispatch();
    const { tasks: tasks, loading, error, success, message } = useSelector(state => state.tasks);
    const [editTask, setEditTask] = useState(null);

    // Fetch tasks on component mount
    useEffect(() => {
        dispatch(getAllTasks());
    }, [dispatch]);

    // Loading state
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen text-gray-500">
                <p>Loading tasks...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-500">
                <p>{message || "Failed to load tasks"}</p>
            </div>
        );
    }

    const handleUpdate = () => {
        if (editTask) {
            dispatch(updateTasks({
                taskId: editTask._id,
                taskData: {
                    title: editTask.title,
                    description: editTask.description,
                    priority: editTask.priority
                }
            }));
            setEditTask(null);
        }
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'short', 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
        });
    }

    return (
        <div className="container mx-auto p-4">
            {/* No tasks available */}
            {tasks.length === 0 ? (
                <p className="text-center text-lg">No tasks available</p>
            ) : (
                <div className="task_container grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {/* Render tasks */}
                    {tasks.map((task) => (
                        <div
                            key={task._id}
                            className="task bg-white relative shadow-lg rounded-lg overflow-hidden hover:shadow-xl transform transition duration-300 ease-in-out mt-3"
                        >
                            <div className="absolute p-1 px-5 w-full flex items-center justify-between shadow-sm shadow-gray-500">
                                <button className="text-3xl" onClick={() => dispatch(deleteTasks(task._id))}>
                                    ❌
                                </button>
                                <button className="text-3xl">
                                    ✅
                                </button>
                                <button className="text-3xl" onClick={() => setEditTask(task)}>📝</button>
                            </div>
                            <img
                                src={task.imageUrl || "https://via.placeholder.com/300"}
                                alt={task.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="font-semibold text-xl text-white">{task.title}</h3>
                                <p className="text-white text-sm mt-2">{task.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-white text-sm">{formatDate(task.createdAt)}</span>
                                    <span className="px-3 py-1 text-white bg-blue-500 rounded-full text-xs">
                                        {task.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {editTask && (
                <div className="fixed inset-0 flex items-center justify-center bg-white  bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold mb-4">Edit Task</h3>
                        <input
                            type="text"
                            className="border p-2 w-full mb-2"
                            placeholder="Title"
                            value={editTask.title}
                            onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                        />
                        <textarea
                            className="border p-2 w-full mb-2"
                            placeholder="Description"
                            value={editTask.description}
                            onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                        />
                        <select
                            className="border p-2 w-full mb-2"
                            value={editTask.priority}
                            onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-4 py-2 bg-blue-500 text-white rounded"
                                onClick={() => handleUpdate(editTask._id)}
                            >
                                Save
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded"
                                onClick={() => setEditTask(null)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TaskList;
