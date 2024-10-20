// src/context/AuthContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

// Define the User type
interface User {
  username: string;
  role: string;
}

// Define the structure of AuthContext
interface AuthContextType {
  user: User | null;
  login: (username: string, role: string) => void;
  logout: () => void;
}

// Create the AuthContext with a default value of undefined
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use the AuthContext easily in any component
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// The AuthProvider component that wraps around other components
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null); // Manages the current user state

  // Function to log the user in
  const login = (username: string, role: string) => {
    setUser({ username, role });
  };

  // Function to log the user out
  const logout = () => {
    setUser(null);
  };

  // Provide user state and auth functions to the children components
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
