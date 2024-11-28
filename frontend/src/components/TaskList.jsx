import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from "react-redux";
import { deleteTasks, getAllTasks, toggleTask, updateTasks } from '../features/TaskSlice';

const TaskList = () => {
    const dispatch = useDispatch();
    const { tasks, error, loading } = useSelector(state => state.tasks);
    const [editingTask, setEditingTask] = useState(null);

    useEffect(() => {
        dispatch(getAllTasks());
    }, [dispatch]);

    const formatDate = (createdAt) => {
        const date = new Date(createdAt);
        return date.toLocaleDateString("en-US", {
            year: 'numeric',
            month: "long",
            day: "numeric",
        });
    };

    const updateHandler = (taskId, taskData) => {
        dispatch(updateTasks({ taskId, taskData }));
        setEditingTask(null);
    };

    const handleToggle = (taskId) => {
        if (taskId) {
            dispatch(toggleTask({ taskId }));
        } else {
            console.error("Task ID is missing.");
        }
    }

    if (error) {
        return <div className="text-center text-red-500 text-lg">Error: {error}</div>;
    }

    return (
        <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {tasks?.length > 0 ? tasks.map((task) => (
                    <div
                        key={task._id}
                        className="bg-white shadow-lg rounded-lg p-5 hover:shadow-xl transition duration-300 transform hover:scale-105 w-full"
                        style={{ maxWidth: '400px', margin: 'auto' }}
                    >
                        <img
                            src="https://via.placeholder.com/400x200"
                            alt="Task Placeholder"
                            className="w-full h-auto rounded-md mb-4"
                        />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{task.title}</h2>
                        <p className="text-gray-600 mb-4">{task.description}</p>
                        <div className="flex items-center justify-between mb-4">
                            <p
                                className={`px-3 py-1 rounded-full text-sm font-semibold ${task.status === "Completed"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-yellow-300 text-yellow-800"
                                    }`}
                            >
                                {task.status}
                            </p>
                            <p className="text-sm text-gray-500">{formatDate(task.createdAt)}</p>
                        </div>
                        <div className='text-3xl py-4 flex gap-15 justify-center'>
                            <button
                                onClick={() => handleToggle(task._id)}
                                className="hover:bg-gray-200 p-2 rounded"
                            >
                                {task.status === "Completed" ? "↩️" : "✅"}
                            </button>
                            <button
                                onClick={() => dispatch(deleteTasks(task._id))}
                                className="hover:bg-gray-200 p-2 rounded"
                            >
                                ❌
                            </button>
                            <button
                                onClick={() => setEditingTask(task)}
                                className="hover:bg-gray-200 p-2 rounded"
                            >
                                📝
                            </button>
                        </div>
                    </div>
                )) : (
                    <p className="text-center font-bold text-white text-3xl">No Tasks Available!</p>
                )}
            </div>
            {editingTask && (
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateHandler(editingTask._id, editingTask);
                    }}
                    className="fixed inset-0 flex items-center justify-center space-y-4 p-6 bg-gray-100 rounded-lg shadow-lg"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    }}
                >
                    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg">
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-lg font-semibold text-gray-700 mb-2"
                            >
                                Task Title
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={editingTask.title}
                                onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                placeholder="Enter task title"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            />
                        </div>
                        <div>
                            <label
                                htmlFor="description"
                                className="block text-lg font-semibold text-gray-700 mb-2"
                            >
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={editingTask.description}
                                onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                placeholder="Add task description"
                                rows="4"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:outline-none"
                            ></textarea>
                        </div>
                        <div>
                            <label
                                htmlFor="priority"
                                className="block text-lg font-semibold text-gray-700 mb-2"
                            >
                                Choose Priority
                            </label>
                            <select
                                value={editingTask.priority || ''}
                                onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value })}
                                name="priority"
                                id="priority"
                                className="w-full bg-green-200 font-bold px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            >
                                <option value="">Choose priority</option>
                                <option value="Medium">Medium</option>
                                <option value="Low">Low</option>
                                <option value="High">High</option>
                            </select>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 mt-4"
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingTask(null)}
                            className="w-full bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 mt-2"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default TaskList;