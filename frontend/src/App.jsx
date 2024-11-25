import React from 'react'
import RegisterPage from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Layout from "./components/Layout.jsx";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<RegisterPage />} />

          <Route element={<Layout />}>
            <Route path='/home' element={<Home />} />
          </Route>
        </Routes>
      </Router>
    </>
  )
}

export default App