// src/components/UserProfile.tsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth(); // Access user data and logout function from context

  // If no user is logged in, show this message
  if (!user) {
    return <p>No user logged in.</p>;
  }

  // Display user information and logout button
  return (
    <div>
      <h2>User Profile</h2>
      <p>Username: {user.username}</p>
      <p>Role: {user.role}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default UserProfile;
