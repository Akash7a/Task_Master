import React from 'react';
import { logoutUser } from '../features/AuthSlice.js';
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutUser());
    navigate("/");
  }

  return (
    <div>
      <form onSubmit={handleLogout}>
        <button
          type="submit"
          className='bg-red-500 font-bold p-4 m-4 px-9 rounded-lg shadow-lg shadow-black hover:bg-orange-700 duration-100'
        >
          Logout
        </button>
      </form>
    </div>
  );
}

export default Home;