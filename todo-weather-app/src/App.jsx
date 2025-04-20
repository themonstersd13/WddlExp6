// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import TodoApp from './pages/TodoApp';
import WeatherApp from './pages/WeatherApp';

const App = () => {
  return (
    <div className="container">
      <header className="navbar">
        {/* In v6, you can still use NavLink – the active class can be set with a function */}
        <NavLink
          to="/todo"
          className={({ isActive }) =>
            isActive ? 'active nav-link' : 'nav-link'
          }
        >
          To‑Do List
        </NavLink>
        <NavLink
          to="/weather"
          className={({ isActive }) =>
            isActive ? 'active nav-link' : 'nav-link'
          }
        >
          Weather App
        </NavLink>
      </header>
      <Routes>
        <Route path="/todo" element={<TodoApp />} />
        <Route path="/weather" element={<WeatherApp />} />
        <Route path="*" element={<TodoApp />} />
      </Routes>
    </div>
  );
};

export default App;
