// components/Navbar.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-blue-600 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-white font-bold text-2xl">
          <Link to="/">TaskMaster</Link>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-4">
          <Link to="/home" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
            Home
          </Link>
          <Link to="/allTasks" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
            Tasks
          </Link>
          <Link to="/completed" className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
            Completed
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-blue-500`}>
        <Link to="/home" className="block text-white px-3 py-2 text-sm font-medium hover:bg-blue-700">
          Home
        </Link>
        <Link to="/allTasks" className="block text-white px-3 py-2 text-sm font-medium hover:bg-blue-700">
          Tasks
        </Link>
        <Link to="/completed" className="block text-white px-3 py-2 text-sm font-medium hover:bg-blue-700">
          Completed
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;