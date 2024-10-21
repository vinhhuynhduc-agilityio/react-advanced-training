import React, { useEffect, useState } from "react";

// components
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import UserListDrawer from "./components/UserListDrawer/UserListDrawer";

// types
import { RowData } from "./types/users";

// utils
import { apiRequest } from "./utils/apiRequest";

const App: React.FC = () => {
  const [users, setUsers] = useState<RowData[]>([]);

  // Fetch all users
  const fetchData = async () => {
    const usersData: RowData[] = await apiRequest('GET', 'http://localhost:3001/users');
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
