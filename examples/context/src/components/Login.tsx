// src/components/Login.tsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const { login } = useAuth(); // Access the login function from context
  const [username, setUsername] = useState(''); // State for username input
  const [role, setRole] = useState(''); // State for role input

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(username, role); // Call login function with input values
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)} // Update username state
        placeholder="Enter username"
        required
      />
      <input
        type="text"
        value={role}
        onChange={(e) => setRole(e.target.value)} // Update role state
        placeholder="Enter role (e.g., admin, user)"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
