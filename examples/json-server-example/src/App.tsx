import React, { useEffect, useState } from 'react';

// Define the type for a task
interface Task {
  id: number;
  name: string;
  completed: boolean;
}

// Function apiRequest with the return type Promise<any>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const apiRequest = async (method: string, url: string, data: any = null): Promise<any> => {
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const App: React.FC = () => {
  // State with the type Task[]
  const [tasks, setTasks] = useState<Task[]>([]);
  // taskName is a string
  const [taskName, setTaskName] = useState<string>('');
  // editingTask can be either Task or null
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Fetch the list of tasks
  const fetchTasks = async () => {
    const data: Task[] = await apiRequest('GET', 'http://localhost:3001/tasks');
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    const newTask: Omit<Task, 'id'> = { name: taskName, completed: false };
    const createdTask: Task = await apiRequest('POST', 'http://localhost:3001/tasks', newTask);
    setTasks([...tasks, createdTask]);
    setTaskName('');
  };

  // Edit a task
  const editTask = (task: Task) => {
    setTaskName(task.name);
    setEditingTask(task);
  };

  // Update a task
  const updateTask = async () => {
    if (!editingTask) return; // Exit if there is no task being edited
    const updatedTask: Task = { ...editingTask, name: taskName };
    await apiRequest('PUT', `http://localhost:3001/tasks/${editingTask.id}`, updatedTask);
    setTasks(tasks.map((task) => (task.id === editingTask.id ? updatedTask : task)));
    setTaskName('');
    setEditingTask(null);
  };

  // Delete a task
  const deleteTask = async (id: number) => {
    await apiRequest('DELETE', `http://localhost:3001/tasks/${id}`);
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      <h1>Task Manager</h1>
      <input
        type="text"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        placeholder="Enter task name"
      />
      <button onClick={editingTask ? updateTask : addTask}>
        {editingTask ? 'Update Task' : 'Add Task'}
      </button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            {task.name}
            <button onClick={() => editTask(task)}>Edit</button>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
