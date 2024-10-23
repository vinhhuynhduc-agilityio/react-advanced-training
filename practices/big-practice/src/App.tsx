import React, { useEffect, useState } from "react";

// components
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import UserListDrawer from "./components/UserListDrawer/UserListDrawer";
import TaskDashboard from "./components/TaskDashboard/TaskDashboard";

// types
import { RowData, TaskData } from "./types/users";

// utils
import { apiRequest } from "./utils/apiRequest";

const App: React.FC = () => {
  const [users, setUsers] = useState<RowData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  console.log('tasks:', tasks)

  // Fetch all users
  const fetchData = async () => {
    const [usersData, tasksData] = await Promise.all([
      apiRequest<RowData[], RowData[]>('GET', 'http://localhost:3001/users'),
      apiRequest<TaskData[], TaskData[]>('GET', 'http://localhost:3001/tasks'),
    ]);
    setUsers(usersData);
    setTasks(tasksData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <div className="flex flex-row flex-grow bg-slate-100 min-h-0">
        <div className="flex-grow-0 ml-1 mr-4 my-4 w-64 ag-theme-alpine overflow-auto">
          <UserListDrawer
            users={users}
          />
        </div>
        <div className="flex-grow bg-slate-100 my-4 overflow-auto">
          <div className="bg-white shadow-lg border-2 border-customBorder h-96">
            <h2 className="text-gray-600 text-xl font-semibold">Row 1: 1 Column</h2>
            <p>Content for the first row</p>
          </div>

          <div className="flex flex-row bg-slate-100 shadow-lg mt-4 h-80">
            <div className="flex-1 mr-4 bg-white border-2 border-customBorder">
              <h2 className="text-gray-600 text-xl font-semibold">Row 2: Column 1</h2>
              <p>Content for column 1 of second row</p>
            </div>
            <div className="flex-1 bg-white border-2 border-customBorder">
              <h2 className="text-gray-600 text-xl font-semibold">Row 2: Column 2</h2>
              <p>Content for column 2 of second row</p>
            </div>
          </div>
          <div className="bg-white shadow-lg mt-4 h-96 border-2 border-customBorder">
            <TaskDashboard
              tasks={tasks}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
