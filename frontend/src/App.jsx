import React from 'react'
import RegisterPage from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import AllTasks from "./components/AllTasks.jsx";

const App = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<Login />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/home' element={<Home />} />
          <Route path='/allTasks' element={<AllTasks />} />
        </Routes>
      </Router>
    </>
  )
}

export default App