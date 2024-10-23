import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TodoApp() {
  // States for the form
  const [task, setTask] = useState('');

  // States for managing tasks (data)
  const [todos, setTodos] = useState([]);
  const [editing, setEditing] = useState(null); // Track the task being edited
  const [editTask, setEditTask] = useState(''); // Track the edited task text

  // Fetch tasks on component mount
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get('http://localhost:5000/todos');
        setTodos(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTodos();
  }, []);

  // Handle adding a new task
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (task === '') return;

    try {
      // Send a POST request to add a new task
      const response = await axios.post('http://localhost:5000/todos', { task });
      setTodos([...todos, { id: response.data.id, task }]); // Add the new task to the state
      setTask(''); // Clear the input after submission
      alert('Task added successfully');
    } catch (error) {
      console.error('Error adding task:', error);
      alert('Failed to add task');
    }
  };

  // Handle deleting a task
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter(todo => todo.id !== id)); // Remove the task from the state
      alert('Task deleted successfully'); // Alert message for delete success
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Failed to delete task'); // Alert message for delete failure
    }
  };

  // Handle starting the edit process
  const handleEdit = (todo) => {
    setEditing(todo.id); // Set the task to edit
    setEditTask(todo.task); // Populate the input with the current task text
  };

  // Handle updating a task
  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/todos/${id}`, { task: editTask });
      setTodos(todos.map(todo => (todo.id === id ? { ...todo, task: editTask } : todo)));
      setEditing(null); // Reset the editing state
      setEditTask(''); // Clear the input after updating
      alert('Task updated successfully'); // Alert message for update success
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task'); // Alert message for update failure
    }
  };

  return (
    <div className="container mt-5">
      {/* Form Section */}
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

      {/* Data Section */}
      <div className="mt-5">
        <h2>List of Tasks</h2>
        {todos.length > 0 ? (
          <ul className="list-group">
            {todos.map((todo) => (
              <li key={todo.id} className="list-group-item d-flex justify-content-between align-items-center">
                {editing === todo.id ? (
                  <>
                    <input
                      type="text"
                      className="form-control"
                      value={editTask}
                      onChange={(e) => setEditTask(e.target.value)}
                    />
                    <button
                      onClick={() => handleUpdate(todo.id)}
                      className="btn btn-success ml-2"
                    >
                      Save
                    </button>
                  </>
                ) : (
                  <>
                    <span>{todo.task}</span>
                    <div>
                      <button
                        onClick={() => handleEdit(todo)}
                        className="btn btn-warning btn-sm ml-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="btn btn-danger btn-sm ml-2"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p>No tasks available. Add a new task!</p>
        )}
      </div>
    </div>
  );
}

export default TodoApp;
