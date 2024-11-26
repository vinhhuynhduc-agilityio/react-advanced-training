import React,
{
  useCallback,
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
import TaskForm from "./TaskForm/TaskForm";
import ChartTotalTasksCompleted from "./ChartTotalTasksCompleted/ChartTotalTasksCompleted";
import ChartTotalTasksByProjects from "./ChartTotalTasksByProjects/ChartTotalTasksByProjects";
import ChartIndividualEmployeeProgress from "./ChartIndividualEmployeeProgress/ChartIndividualEmployeeProgress";

// types
import {
  UserFormData,
  ProjectsData,
  TaskData,
  UserData
} from "@/types/table";
import { TaskFormData } from "@/types/taskForm";

// utils
import { apiRequest } from "@/services/apiRequest";

// constant
import { initialDefaultValues } from "@/constant/dashboard";

// ag-grid
import { GridApi } from "ag-grid-community";

// helpers
import {
  formatStartDate,
  getRegisteredDate,
  handlesScrollingToNewUserOrTask
} from "../../helpers/dashboard";
import { API_ROUTES } from "@/constant/api";

import { API_BASE_URL } from "@/config";

const Dashboard: React.FC = () => {
  const userListGridApi = useRef<GridApi | null>(null);
  const taskDashboardGridApi = useRef<GridApi | null>(null);

  const [users, setUsers] = useState<UserData[]>([]);
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [projects, setProjects] = useState<ProjectsData[]>([]);
  const [selectedUserId, setSelectedUser] = useState<string | null>(null);
  const [sourceComponent, setSourceComponent] = useState<string | null>(null);

  // State variables related to opening modal dialog
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditUser, setEditUser] = useState(false);
  const [defaultValues, setDefaultValues] = useState<UserData>(initialDefaultValues);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  // State to track loading
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          usersData,
          tasksData,
          projectsData
        ] = await Promise.all([
          apiRequest<UserData[], UserData[]>('GET', `${API_BASE_URL}${API_ROUTES.USERS}`),
          apiRequest<TaskData[], TaskData[]>('GET', `${API_BASE_URL}${API_ROUTES.TASKS}`),
          apiRequest<ProjectsData[], ProjectsData[]>('GET', `${API_BASE_URL}${API_ROUTES.PROJECTS}`),
        ]);
        setUsers(usersData);
        setTasks(tasksData);
        setProjects(projectsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  const registerGridApiTaskDashboard = (api: GridApi) => {
    taskDashboardGridApi.current = api
  };

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
    currency: number,
    status: boolean
  ) => {
    handleTaskRowSelected(newUserId);

    if (!userListGridApi.current || !status) return;

    setLoading(true);
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
          apiRequest<UserData, UserData>("PUT", `${API_BASE_URL}${API_ROUTES.USERS}/${userId}`, {
            ...rowNode.data,
            earnings: `$${adjustedEarnings}`,
          })
        );
      }
    });

    try {
      await Promise.all(updates);
    } catch (error) {
      console.error("Failed to update earnings:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateEarningsOnStatusChange = async (
    userId: string,
    currency: number,
    status: boolean
  ) => {
    if (!userListGridApi.current) return;
    setLoading(true);

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
      try {
        await apiRequest<UserData, UserData>(
          "PUT",
          `${API_BASE_URL}${API_ROUTES.USERS}/${userId}`,
          {
            ...rowNode.data,
            earnings: `$${adjustedEarnings}`,
          }
        );
      } catch (error) {
        console.error("Failed to update earnings:", error);
      } finally {
        setLoading(false);
      }
    };
  };
  const registerGridApi = (api: GridApi) => {
    userListGridApi.current = api
  };

  const handleToggleProjectForm = useCallback(() => {
    setProjectModalOpen(true);
  }, []);

  const handleToggleTaskForm = useCallback(() => {
    setTaskModalOpen(true);
  }, []);

  const handleToggleUserProfileForm = useCallback(() => {
    setDefaultValues(initialDefaultValues);
    setModalOpen(true);
    setEditUser(false);
  }, []);

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

    setLoading(true);
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
        `${API_BASE_URL}${API_ROUTES.USERS}`,
        newUser
      );

      // Update state users to add new users
      setUsers((prevUsers) => [...prevUsers, addedUser]);

      setModalOpen(false);

      // Handles scrolling to new user
      if (userListGridApi.current) {
        handlesScrollingToNewUserOrTask(newUser.id, userListGridApi.current)
      }

      // handle selected for new user
      handleUserRowSelected(newUser.id);
    } catch (error) {
      console.error("Failed to add new user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = async (data: UserFormData) => {
    if (!defaultValues?.id) return;
    setLoading(true);

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
        `${API_BASE_URL}${API_ROUTES.USERS}/${defaultValues.id}`,
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
    } finally {
      setLoading(false);
    }
  };

  const handleAddNewTask = async (data: TaskFormData) => {
    const {
      currency,
      project,
      taskName,
      user
    } = data;
    const currencyValue = typeof currency === 'string'
      ? parseInt(currency, 10)
      : currency;

    setLoading(true);

    const newTask = {
      id: uuidv4(),
      userId: user.id,
      projectId: project.id,
      taskName: taskName,
      startDate: formatStartDate(new Date()),
      completedDate: 'incomplete',
      currency: currencyValue,
      status: false,
      projectName: project.value,
      fullName: user.value
    };

    try {
      const addedTask = await apiRequest<TaskData, TaskData>(
        "POST",
        `${API_BASE_URL}${API_ROUTES.TASKS}`,
        newTask
      );

      setTasks((prevTasks) => [...prevTasks, addedTask]);
      setTaskModalOpen(false);

      // Handles scrolling to new user
      if (taskDashboardGridApi.current) {
        handlesScrollingToNewUserOrTask(newTask.id, taskDashboardGridApi.current)
      }

      // handle selected for new task
      handleTaskRowSelected(newTask.userId);
    } catch (error) {
      console.error("Failed to add new task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProject = async (newProjectName: string) => {
    const newProject = {
      id: uuidv4(),
      projectName: newProjectName
    };
    setLoading(true);

    try {
      const addedProject = await apiRequest<ProjectsData, ProjectsData>(
        'POST',
        `${API_BASE_URL}${API_ROUTES.PROJECTS}`,
        newProject
      );

      setProjects((prevProjects) => [...prevProjects, addedProject]);
      setProjectModalOpen(false);
    } catch (error) {
      console.error("Failed to add new project:", error);
    } finally {
      setLoading(false);
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
          registerGridApiTaskDashboard={registerGridApiTaskDashboard}
          setTasks={setTasks}
          isLoading={isLoading}
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
          isLoading={isLoading}
        />
      </div>
    )
  };

  const renderHeader = () => {
    return (
      <Header
        onAddUser={handleToggleUserProfileForm}
        onAddProject={handleToggleProjectForm}
        onAddTask={handleToggleTaskForm}
      />
    )
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

  const renderTaskForm = () => (
    <ModalDialog
      title="Add Task"
      onClose={() => setTaskModalOpen(false)}
      content={
        <TaskForm
          onClose={() => setTaskModalOpen(false)}
          onSubmit={handleAddNewTask}
          tasks={tasks}
          projects={projects}
          users={users}
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
        <ChartTotalTasksCompleted
          tasks={tasks}
          isLoading={isLoading}
        />
        <div className="flex flex-row bg-slate-100 mt-4 h-[302px]">
          <ChartIndividualEmployeeProgress
            tasks={tasks}
            users={users}
            selectedUserId={selectedUserId}
            isLoading={isLoading}
          />
          <ChartTotalTasksByProjects
            tasks={tasks}
            projects={projects}
            isLoading={isLoading}
          />
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
        <Footer
          content='Team Progress App'
        />
      </div>
      {isModalOpen && renderUserProfileForm()}
      {isProjectModalOpen && renderProjectForm()}
      {isTaskModalOpen && renderTaskForm()}
    </>
  );
};

export default Dashboard;
