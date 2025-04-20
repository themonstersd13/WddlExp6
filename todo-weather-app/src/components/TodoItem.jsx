import React, { useState } from 'react';

const TodoItem = ({ task, updateTask, deleteTask }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDeadline, setEditedDeadline] = useState(task.deadline);

  const handleSave = () => {
    updateTask(task.id, { title: editedTitle, deadline: editedDeadline });
    setIsEditing(false);
  };

  return (
    <div className="todo-item">
      {isEditing ? (
        <div className="item-edit">
          <input 
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
          />
          <input 
            type="datetime-local"
            value={editedDeadline}
            onChange={(e) => setEditedDeadline(e.target.value)}
          />
          <button className="button" onClick={handleSave}>Save</button>
          <button className="button" onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <div className="item-info">
            <strong>{task.title}</strong>
            <div className="item-deadline">
              Deadline: {new Date(task.deadline).toLocaleString()}
            </div>
          </div>
          <div className="item-actions">
            <button className="button" onClick={() => setIsEditing(true)}>Edit</button>
            <button className="button" onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        </>
      )}
    </div>
  );
};

export default TodoItem;

