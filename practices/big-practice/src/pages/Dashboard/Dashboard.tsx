import React,
{
  useEffect,
  useRef,
  useState
} from "react";

// components
import Header from "@/components/Header/Header";
import UserListDrawer from "./UserListDrawer/UserListDrawer";
import TaskDashboard from "./TaskDashboard/TaskDashboard";
import Footer from "@/components/Footer/Footer";

// types
import {
  ProjectsData,
  TaskData,
  UserData
} from "@/types/table";

// utils
import { apiRequest } from "@/utils/apiRequest";

// ag-grid
import { GridApi } from "ag-grid-community";


const Dashboard: React.FC = () => {
  const userListGridApi = useRef<GridApi | null>(null);

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

  const updateEarningsForUsers = async (
    oldUserId: string,
    newUserId: string,
    currency: number
  ) => {
    if (!userListGridApi.current) return;

    const updates: Promise<UserData>[] = [];

    [oldUserId, newUserId].forEach(userId => {
      const rowNode = userListGridApi.current!.getRowNode(userId);

      if (rowNode) {
        const currentEarnings = parseInt(rowNode.data.earnings.slice(1)) || 0;
        const adjustedEarnings = userId === oldUserId
          ? currentEarnings - currency
          : currentEarnings + currency;

        rowNode.setData({
          ...rowNode.data,
          earnings: `$${adjustedEarnings}`
        });

        updates.push(
          apiRequest<UserData, UserData>("PUT", `http://localhost:3001/users/${userId}`, {
            ...rowNode.data,
            earnings: `$${adjustedEarnings}`,
          })
        );
      }
    });

    handleTaskRowSelected(newUserId);

    try {
      await Promise.all(updates);
    } catch (error) {
      console.error("Failed to update earnings:", error);
    }
  };

  const updateEarningsOnStatusChange = async (
    userId: string,
    currency: number,
    status: boolean
  ) => {
    if (!userListGridApi.current) return;

    // Retrieve `rowNode` by `userId` to update the specific row
    const rowNode = userListGridApi.current.getRowNode(userId);

    if (rowNode) {
      const currentEarnings = parseInt(rowNode.data.earnings.slice(1)) || 0;
      const adjustedEarnings = status
        ? currentEarnings + currency
        : currentEarnings - currency;

      // Update row edit data
      rowNode.setData({
        ...rowNode.data,
        earnings: `$${adjustedEarnings}`
      });

      // Update earnings to backend
      await apiRequest<UserData, UserData>("PUT", `http://localhost:3001/users/${userId}`, {
        ...rowNode.data,
        earnings: `$${adjustedEarnings}`,
      });
    }
  };

  const registerGridApi = (api: GridApi) => {
    userListGridApi.current = api
  };

  const renderTaskDashboard = () => {

    return (
      <TaskDashboard
        tasks={tasks}
        projects={projects}
        users={users}
        selectedUserId={selectedUserId}
        onTaskRowSelected={handleTaskRowSelected}
        sourceComponent={sourceComponent}
        updateEarningsForUsers={updateEarningsForUsers}
        updateEarningsOnStatusChange={updateEarningsOnStatusChange}
      />
    )
  };

  const renderUserListDrawer = () => {

    return (
      <UserListDrawer
        users={users}
        selectedUserId={selectedUserId}
        onUserSelected={handleUserRowSelected}
        sourceComponent={sourceComponent}
        registerGridApi={registerGridApi}
      />
    )
  };

  return (
    <div className="flex flex-col h-screen w-screen">
      <Header />
      <div className="flex flex-row flex-grow bg-slate-100 min-h-0">
        <div className="flex-grow-0 ml-1 mr-4 my-4 w-64 ag-theme-alpine overflow-auto">
          {renderUserListDrawer()}
        </div>
        <div className="flex-grow bg-slate-100 my-4 mr-4 overflow-auto">
          <div className="bg-white border border-customBorder h-96">
            <h2 className="text-gray-600 text-xl font-semibold">Row 1: Column 1</h2>
          </div>

          <div className="flex flex-row bg-slate-100 mt-4 h-80">
            <div className="flex-1 mr-4 bg-white border border-customBorder">
              <h2 className="text-gray-600 text-xl font-semibold">Row 2: Column 1</h2>
            </div>
            <div className="flex-1 bg-white border border-customBorder">
              <h2 className="text-gray-600 text-xl font-semibold">Row 2: Column 2</h2>
            </div>
          </div>
          <div className="bg-white mt-4 h-96 border-customBorder">
            {renderTaskDashboard()}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Dashboard;
