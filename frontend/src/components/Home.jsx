import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { createTask } from "../features/TaskSlice.js";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();


  // Initialize form state
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    priority: "medium", // Default value for priority
    dueDate: "",
  });

  const { loading, error } = useSelector((state) => state.tasks);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(createTask(taskData)).unwrap()
      .then(() => {
        setTaskData({
          title: "",
          description: "",
          priority: "medium", // Reset to default value
          dueDate: "",
        });
        navigate("/allTasks");
      })
      .catch((err) => {
        console.error("Failed to create task:", err);
      });
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">Create a New Task</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={taskData.title}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Description Input */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Priority Select */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Priority</label>
          <select
            name="priority"
            value={taskData.priority}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Due Date Input */}
        <div>
          <label className="block text-lg font-medium text-gray-700">Due Date</label>
          <input
            type="date"
            name="dueDate"
            value={taskData.dueDate}
            onChange={handleInputChange}
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 disabled:bg-gray-400"
          >
            {loading ? "Creating..." : "Create Task"}
          </button>
        </div>

        {/* Error Message */}
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Home;