import React from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import Navbar from './Nav';
import Footer from './Footer';

const Layout = () => {
    const location = useLocation();

    const hideNavbar = location.pathname === '/' || location.pathname === '/register';

    return (
        <div>
            <div className=''>
                <Navbar />
                <Outlet />
                <Footer />
            </div>
        </div>
    )
}

export default Layout