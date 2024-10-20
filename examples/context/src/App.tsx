// src/App.tsx
import React from 'react';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import UserProfile from './components/UserProfile';

const App: React.FC = () => {
  return (
    // Wrap the app in AuthProvider to make the auth state available throughout the app
    <AuthProvider>
      <h1>User Authentication Example</h1>
      <Login /> 
      <UserProfile />
    </AuthProvider>
  );
};

export default App;
