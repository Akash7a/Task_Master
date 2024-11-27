import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearError, clearSuccess, createTasks } from "../features/TaskSlice.js";
import TaskList from "./TaskList.jsx";

const Home = () => {
  const dispatch = useDispatch();
  const { success, error, message, loading } = useSelector((state) => state.tasks);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "",
    dueDate: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createTasks(formData));
  };

  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        dispatch(clearSuccess());
        dispatch(clearError());
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [error, success, dispatch]);

  useEffect(() => {
    if (success) {
      setFormData({
        title: "",
        description: "",
        priority: "",
        dueDate: "",
      });
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 flex items-center justify-center flex-col p-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">Create a New Task</h1>
        {success && (
          <div className="bg-green-100 text-green-800 p-4 mb-4 rounded-lg">
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-800 p-4 mb-4 rounded-lg">
            <p>{message}</p>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
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
              value={formData.title}
              onChange={changeHandler}
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
              value={formData.description}
              onChange={changeHandler}
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
              value={formData.priority}
              onChange={changeHandler}
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
          <div>
            <label
              htmlFor="dueDate"
              className="block text-lg font-semibold text-gray-700 mb-2"
            >
              Due Date
            </label>
            <input
              type="date"
              id="dueDate"
              name="dueDate"
              value={formData.dueDate}
              onChange={changeHandler}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:shadow-lg transform hover:scale-105 transition"
          >
            {loading ? "Adding..." : "Add Task"}
          </button>
        </form>
      </div>
      <h2 className="text-3xl font-bold text-white p-4 mt-4 underline">Your Tasks</h2>
      <TaskList />
    </div>
  );
};

export default Home;