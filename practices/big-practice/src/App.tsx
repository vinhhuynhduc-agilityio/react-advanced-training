import React, { useEffect, useState } from "react";

// components
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import UserListDrawer from "./components/UserListDrawer/UserListDrawer";
import TaskDashboard from "./components/TaskDashboard/TaskDashboard";

// types
import {
  ProjectsData,
  UserData,
  TaskData
} from "./types/table";

// utils
import { apiRequest } from "./utils/apiRequest";

const App: React.FC = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [projects, setProjects] = useState<ProjectsData[]>([]);
  const [selectedUserId, setSelectedUser] = useState<string | null>(null);
  const [sourceComponent, setSourceComponent] = useState<string | null>(null);

  // Fetch all users
  const fetchData = async () => {
    const [
      usersData,
      tasksData,
      projects
    ] = await Promise.all([
      apiRequest<UserData[], UserData[]>('GET', 'http://localhost:3001/users'),
      apiRequest<TaskData[], TaskData[]>('GET', 'http://localhost:3001/tasks'),
      apiRequest<ProjectsData[], ProjectsData[]>('GET', 'http://localhost:3001/projects'),
    ]);
    setUsers(usersData);
    setTasks(tasksData);
    setProjects(projects);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to handle when row in TaskDashboard is selected
  const handleTaskRowSelected = (userId: string | null) => {
    setSelectedUser(userId)
    setSourceComponent("TaskDashboard");
  };

  // Function to handle when row in UserListDrawer is selected
  const handleUserRowSelected = (userId: string | null) => {
    setSourceComponent("UserListDrawer");
    setSelectedUser(userId)
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <div className="flex flex-row flex-grow bg-slate-100 min-h-0">
        <div className="flex-grow-0 ml-1 mr-4 my-4 w-64 ag-theme-alpine overflow-auto">
          <UserListDrawer
            users={users}
            selectedUserId={selectedUserId}
            onUserSelected={handleUserRowSelected}
            sourceComponent={sourceComponent}
          />
        </div>
        <div className="flex-grow bg-slate-100 my-4 mr-4 overflow-auto">
          <div className="bg-white border-2 border-customBorder h-96">
            <h2 className="text-gray-600 text-xl font-semibold">Row 1: Column 1</h2>
            <p>Content for the first row</p>
          </div>

          <div className="flex flex-row bg-slate-100 mt-4 h-80">
            <div className="flex-1 mr-4 bg-white border-2 border-customBorder">
              <h2 className="text-gray-600 text-xl font-semibold">Row 2: Column 1</h2>
              <p>Content for column 1 of second row</p>
            </div>
            <div className="flex-1 bg-white border-2 border-customBorder">
              <h2 className="text-gray-600 text-xl font-semibold">Row 2: Column 2</h2>
              <p>Content for column 2 of second row</p>
            </div>
          </div>
          <div className="bg-white mt-4 h-96 border-customBorder">
            <TaskDashboard
              tasks={tasks}
              projects={projects}
              users={users}
              selectedUserId={selectedUserId}
              onTaskRowSelected={handleTaskRowSelected}
              sourceComponent={sourceComponent}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default App;
