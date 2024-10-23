import React, { useState } from 'react';
import axios from 'axios';

function Form() {
  const [task, setTask] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task === '') return;

    try {
      // Send a POST request to the backend to add a new task
      await axios.post('http://localhost:5000/todos', { task });
      setTask(''); // Clear the input after submission
      alert('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Add a New Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="task">Task</label>
          <input
            type="text"
            className="form-control"
            id="task"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter your task"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Task</button>
      </form>
    </div>
  );
}

export default Form;
