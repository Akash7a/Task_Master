import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError, clearSuccess } from '../features/AuthSlice';
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        usernameOrEmail: "",
        password: "",
    });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector((state) => state.auth);

    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        if (error) {
            setMessage(error);
            setIsError(true);
            dispatch(clearError());
        } else if (success) {
            setMessage("Login Successful");
            setIsError(false);
            navigate("/home");
            setTimeout(() => {
                dispatch(clearSuccess());
            }, 3000);
        }
    }, [error, success, dispatch]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage("");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [message]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(loginUser(formData));
        setFormData({
            usernameOrEmail: "",
            password: "",
        });
    }

    return (
        <>
            <div className='flex justify-center items-center h-screen bg-gray-100'>
                <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">Username or Email</label>
                            <input
                                type="text"
                                id="username"
                                name="usernameOrEmail"
                                value={formData.usernameOrEmail}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder='Enter username or email'
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder='Enter your password'
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <button type='submit' className='text-center hover:bg-blue-500 duration-75 font-bold bg-orange-600 rounded-lg shadow-lg shadow-gray-500 w-full p-3 text-white '>
                            {loading ? 'Logging in...' : "Login"}
                        </button>
                    </form>

                    {message && (
                        <div
                            style={{
                                color: isError ? "red" : "green",
                                textAlign: "center",
                                marginTop: "10px",
                                padding: "10px",
                                background: isError ? "#fdd" : "#dfd",
                                borderRadius: "5px"
                            }}
                        >
                            {message}
                        </div>
                    )}
                    <h2 className='mt-5 text-center'>
                        <Link to="/register" className="text-blue-500 hover:underline text-center w-full mt-5">Don't have a Accout? Register.</Link>
                    </h2>
                </div>
            </div>
        </>
    )
}

export default Login;