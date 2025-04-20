import React, { useState, useEffect } from 'react';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import DarkModeToggle from '../components/DarkModeToggle';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const addTask = (task) => {
    const newTask = {
      id: Date.now(),
      title: task.title,
      deadline: task.deadline,
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id, updatedData) => {
    setTasks(prev => prev.map(task => task.id === id ? { ...task, ...updatedData } : task));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const reorderTasks = (startIndex, endIndex) => {
    const newTasks = Array.from(tasks);
    const [removed] = newTasks.splice(startIndex, 1);
    newTasks.splice(endIndex, 0, removed);
    setTasks(newTasks);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      tasks.forEach(task => {
        const diff = new Date(task.deadline) - now;
        if (diff > 0 && diff < 60000) {
          alert(`Reminder: "${task.title}" is due soon!`);
        }
      });
    }, 60000);
    return () => clearInterval(interval);
  }, [tasks]);

   useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark-mode');
    else document.documentElement.classList.remove('dark-mode');
  }, [isDarkMode]);

  return (
    <div className="todo-container">
      <h1>Enhanced To‑Do List</h1>
      <div className="toggle-container">
        <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={() => setIsDarkMode(prev => !prev)} />
      </div>
      <TodoForm addTask={addTask} />
      <TodoList 
        tasks={tasks} 
        updateTask={updateTask} 
        deleteTask={deleteTask} 
        reorderTasks={reorderTasks} 
      />
    </div>
  );
};

export default TodoApp;

