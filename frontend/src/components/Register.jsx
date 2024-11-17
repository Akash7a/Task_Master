import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError, clearSuccess } from '../features/AuthSlice';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'User',
  });

  const { loading, error, success } = useSelector((state) => state.auth);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (error) {
      setMessage(error);
      setIsError(true);
      dispatch(clearError());
    } else if (success) {
      setMessage('Registration Successful!');
      setIsError(false);
      setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      navigate('/'); // Redirect to login page after successful registration
    }
  }, [error, success, dispatch, navigate]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 3000); // Clear the message after 3 seconds

      return () => clearTimeout(timer); // Clean up the timer
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser(formData));
    setFormData({
      username: '',
      email: '',
      password: '',
      role: 'User', // Reset role to User after submission
    });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Role Selector */}
          <div className="mb-6">
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="User">User</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {/* Error / Success Messages */}
          {message && (
            <div
              style={{
                color: isError ? 'red' : 'green',
                textAlign: 'center',
                marginTop: '10px',
                padding: '10px',
                background: isError ? '#fdd' : '#dfd',
                borderRadius: '5px',
              }}
            >
              {message}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full py-2 bg-orange-500 font-bold shadow-lg shadow-gray-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        <h2 className="mt-5 text-center">
          <Link to="/" className="text-blue-500 hover:underline text-center w-full mt-5">
            Already have an Account? Login.
          </Link>
        </h2>
      </div>
    </div>
  );
};

export default RegisterPage;