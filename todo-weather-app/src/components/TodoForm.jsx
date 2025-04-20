import React, { useState } from 'react';

const TodoForm = ({ addTask }) => {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !deadline) return;
    addTask({ title, deadline });
    setTitle('');
    setDeadline('');
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input 
        type="text" 
        placeholder="Task description" 
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input 
        type="datetime-local" 
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />
      <button type="submit" className="button">Add Task</button>
    </form>
  );
};

export default TodoForm;
