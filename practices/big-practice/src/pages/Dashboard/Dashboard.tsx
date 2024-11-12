import React,
{
  useEffect,
  useRef,
  useState
} from "react";
import { v4 as uuidv4 } from 'uuid';

// components
import Header from "@/components/Header/Header";
import UserListDrawer from "./UserListDrawer/UserListDrawer";
import TaskDashboard from "./TaskDashboard/TaskDashboard";
import Footer from "@/components/Footer/Footer";
import ModalDialog from "@/components/ModalDialog/ModalDialog";
import UserProfileForm from "./UserProfileForm/UserProfileForm";
import ProjectForm from "./ProjectForm/ProjectForm";

// types
import {
  UserFormData,
  ProjectsData,
  TaskData,
  UserData
} from "@/types/table";

// utils
import { apiRequest } from "@/utils/apiRequest";

// constant
import { initialDefaultValues } from "./constant/Dashboard";

// ag-grid
import { GridApi } from "ag-grid-community";
import { getRegisteredDate } from "./helpers/Dashboard";

const Dashboard: React.FC = () => {
  const userListGridApi = useRef<GridApi | null>(null);

  const [users, setUsers] = useState<UserData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [projects, setProjects] = useState<ProjectsData[]>([]);
  const [selectedUserId, setSelectedUser] = useState<string | null>(null);
  const [sourceComponent, setSourceComponent] = useState<string | null>(null);

  // State variables related to opening modal dialog
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [isEditUser, setEditUser] = React.useState(false);
  const [defaultValues, setDefaultValues] = useState<UserData>(initialDefaultValues);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);

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
      await apiRequest<UserData, UserData>(
        "PUT",
        `http://localhost:3001/users/${userId}`,
        {
          ...rowNode.data,
          earnings: `$${adjustedEarnings}`,
        });
    }
  };

  const registerGridApi = (api: GridApi) => {
    userListGridApi.current = api
  };

  const handleToggleProjectForm = () => {
    setProjectModalOpen(true);
  };

  const handleToggleUserProfileForm = () => {
    setDefaultValues(initialDefaultValues)
    setModalOpen(true);
    setEditUser(false);
  };

  const handleUserDoubleClicked = (userData: UserData) => {
    setDefaultValues(userData);
    setModalOpen(true);
    setEditUser(true);
  };

  const handleOnSubmit = (data: UserFormData) =>
    isEditUser
      ? handleEditUser(data)
      : handleAddNewUser(data);

  const handleAddNewUser = async (data: UserFormData) => {
    const avatarUrl = data.avatarUrl ?? 'https://via.placeholder.com/80';
    const registeredDate = getRegisteredDate();

    const newUser = {
      id: uuidv4(),
      fullName: data.fullName,
      earnings: "$0",
      email: data.email,
      avatarUrl: avatarUrl,
      registered: registeredDate,
      lastUpdated: registeredDate,
    };

    try {
      const addedUser = await apiRequest<UserData, UserData>(
        'POST',
        'http://localhost:3001/users',
        newUser
      );

      // Update state users to add new users
      setUsers((prevUsers) => [...prevUsers, addedUser]);

      setModalOpen(false);
    } catch (error) {
      console.error("Failed to add new user:", error);
    }
  };

  const handleEditUser = async (data: UserFormData) => {
    if (!defaultValues?.id) return;

    const editUser: UserData = {
      id: defaultValues.id,
      fullName: data.fullName,
      earnings: defaultValues.earnings,
      email: data.email,
      avatarUrl: data.avatarUrl || "https://via.placeholder.com/80",
      registered: defaultValues.registered,
      lastUpdated: getRegisteredDate(),
    };

    try {

      // Send user update request
      const updatedUser = await apiRequest<UserData, UserData>(
        "PUT",
        `http://localhost:3001/users/${defaultValues.id}`,
        editUser
      );

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === defaultValues.id
            ? updatedUser
            : user
        )
      );

      setModalOpen(false);
    } catch (error) {
      console.error("Failed to edit user:", error);
    }
  };

  const renderTaskDashboard = () => {
    return (
      <div className="bg-white mt-4 h-96 border-customBorder">
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
      </div>
    )
  };

  const renderUserListDrawer = () => {
    return (
      <div className="flex-grow-0 ml-1 mr-4 my-4 w-64 ag-theme-alpine overflow-auto">
        <UserListDrawer
          users={users}
          selectedUserId={selectedUserId}
          onUserSelected={handleUserRowSelected}
          sourceComponent={sourceComponent}
          registerGridApi={registerGridApi}
          onUserDoubleClicked={handleUserDoubleClicked} 
        />
      </div>
    )
  };

  const renderHeader = () => {
    return (
      <Header
        onAddUser={handleToggleUserProfileForm}
        onAddProject={handleToggleProjectForm}
      />
    )
  };

  const handleAddProject = async (newProjectName: string) => {
    const newProject = {
      id: uuidv4(),
      projectName: newProjectName
    };

    try {
      const addedProject = await apiRequest<ProjectsData, ProjectsData>(
        'POST',
        'http://localhost:3001/projects',
        newProject
      );

      setProjects((prevProjects) => [...prevProjects, addedProject]);
      setProjectModalOpen(false);
    } catch (error) {
      console.error("Failed to add new project:", error);
    }
  };

  const renderProjectForm = () => (
    <ModalDialog
      title="Add Project"
      onClose={() => setProjectModalOpen(false)}
      content={
        <ProjectForm
          projects={projects}
          onClose={() => setProjectModalOpen(false)}
          onSubmit={handleAddProject}
        />
      }
    />
  );

  const renderUserProfileForm = () => {
    const title = isEditUser ? "Edit User" : "Add User";
    const buttonLabel = isEditUser ? "Save" : "Add";

    return (
      <ModalDialog
        title={title}
        onClose={() => setModalOpen(false)}
        content={
          <UserProfileForm
            defaultValues={defaultValues}
            isEditUser={isEditUser}
            onClose={() => setModalOpen(false)}
            onSubmit={handleOnSubmit}
            users={users}
            buttonLabel={buttonLabel}
          />
        }
      />
    );
  };

  const renderChartAndTaskContent = () => {
    return (
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
        {renderTaskDashboard()}
      </div>
    )
  };

  const renderContent = () => {
    return (
      <div className="flex flex-row flex-grow bg-slate-100 min-h-0">
        {renderUserListDrawer()}
        {renderChartAndTaskContent()}
      </div>
    )
  };

  return (
    <>
      <div className="flex flex-col h-screen w-screen">
        {renderHeader()}
        {renderContent()}
        <Footer />
      </div>
      {isModalOpen && renderUserProfileForm()}
      {isProjectModalOpen && renderProjectForm()}
    </>
  );
};

export default Dashboard;
