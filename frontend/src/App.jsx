import React from 'react';
import { Home, Layout, Login, RegisterPage, TaskList } from "./components/Index.js";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/register' element={<RegisterPage />} />

        <Route element={<Layout />}>
          <Route path='/home' element={<Home />} />
          <Route path='/taskList' element={<TaskList />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;