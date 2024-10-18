import React, { useEffect, useState } from "react";

// components
import Header from "./components/Header";
import UserListDrawer from "./components/UserListDrawer";
import { Footer } from "./components/Footer";

// types
import { User } from "./types/users";

// utils
import { apiRequest } from "./utils/apiRequest";

const App: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  // Fetch all users
  const fetchData = async () => {
    const usersData: User[] = await apiRequest('GET', 'http://localhost:3001/users');
    setUsers(usersData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-slate-100 w-screen">
      <Header />
      <UserListDrawer
        users={users}
      />
      <Footer />
    </div>
  );
};

export default App;
