import React,
{
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import { v4 as uuidv4 } from 'uuid';

// lazy
const UserProfileForm = lazy(() => import('@/components/UserProfileForm'));
const TaskForm = lazy(() => import('@/components/TaskForm'));
const ProjectForm = lazy(() => import('@/components/ProjectForm'));

// components
import {
  ChartIndividualEmployeeProgress,
  ChartTotalTasksByProjects,
  ChartTotalTasksCompleted,
  ModalDialog,
  Footer,
  Header,
  UserListDrawer,
  TaskDashboard,
  ErrorBoundary
} from '@/components';
import { Spinner } from '@/components/common';

// types
import {
  UserFormData,
  ProjectsData,
  TaskData,
  UserData,
  TaskFormData
} from '@/types';

// utils
import { apiRequest } from '@/services';

// constant
import { API_ROUTES, initialDefaultValues } from '@/constant';

// ag-grid
import { GridApi } from 'ag-grid-community';

// helpers
import {
  formatStartDate,
  getRegisteredDate,
  handlesScrollingToNewUserOrTask
} from '@/helpers';

import { API_BASE_URL } from '@/config';

// context
import { DashboardContext } from '@/context';

// hooks
import { useFetchData, useRowSelection } from '@/hooks';

const Dashboard: React.FC = () => {
  const userListGridApi = useRef<GridApi | null>(null);
  const taskDashboardGridApi = useRef<GridApi | null>(null);

  // State variables related to opening modal dialog
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditUser, setEditUser] = useState(false);
  const [defaultValues, setDefaultValues] = useState<UserData>(initialDefaultValues);
  const [isProjectModalOpen, setProjectModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);

  // State to track loading
  const [isSavingUser, setSavingUser] = useState(false);
  const [isSavingTask, setSavingTask] = useState(false);
  const [isSavingProject, setSavingProject] = useState(false);

  const { users, tasks, projects, isLoading, setUsers, setTasks, setProjects } = useFetchData();
  const { selectedUserId, sourceComponent, handleRowSelected } = useRowSelection();

  const registerGridApiTaskDashboard = (api: GridApi) => {
    taskDashboardGridApi.current = api
  };

  // Function to handle when row in TaskDashboard is selected
  const handleTaskRowSelected = (userId: string | null) => {
    handleRowSelected(userId, 'TaskDashboard');
  };

  // Function to handle when row in UserListDrawer is selected
  const handleUserRowSelected = (userId: string | null) => {
    handleRowSelected(userId, 'UserListDrawer');
  };

  const updateEarningsForUsers = async (
    oldUserId: string,
    newUserId: string,
    currency: number,
    status: boolean
  ) => {
    handleTaskRowSelected(newUserId);

    if (!userListGridApi.current || !status) return;

    setSavingUser(true);
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
          apiRequest<UserData, UserData>('PUT', `${API_BASE_URL}${API_ROUTES.USERS}/${userId}`, {
            ...rowNode.data,
            earnings: `$${adjustedEarnings}`,
          })
        );
      }
    });

    try {
      await Promise.all(updates);
    } catch (error) {
      console.error('Failed to update earnings:', error);
    } finally {
      setSavingUser(false);
    }
  };

  const updateEarningsOnStatusChange = async (
    userId: string,
    currency: number,
    status: boolean
  ) => {
    if (!userListGridApi.current) return;
    setSavingUser(true);

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
          'PUT',
          `${API_BASE_URL}${API_ROUTES.USERS}/${userId}`,
          {
            ...rowNode.data,
            earnings: `$${adjustedEarnings}`,
          }
        );
      } catch (error) {
        console.error('Failed to update earnings:', error);
      } finally {
        setSavingUser(false);
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

    setSavingUser(true);
    const newUser = {
      id: uuidv4(),
      fullName: data.fullName,
      earnings: '$0',
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
      console.error('Failed to add new user:', error);
    } finally {
      setSavingUser(false);
    }
  };

  const handleEditUser = async (data: UserFormData) => {
    if (!defaultValues?.id) return;
    setSavingUser(true);

    const editUser: UserData = {
      id: defaultValues.id,
      fullName: data.fullName,
      earnings: defaultValues.earnings,
      email: data.email,
      avatarUrl: data.avatarUrl || 'https://via.placeholder.com/80',
      registered: defaultValues.registered,
      lastUpdated: getRegisteredDate(),
    };

    try {

      // Send user update request
      const updatedUser = await apiRequest<UserData, UserData>(
        'PUT',
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
      console.error('Failed to edit user:', error);
    } finally {
      setSavingUser(false);
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

    setSavingTask(true);

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
        'POST',
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
      console.error('Failed to add new task:', error);
    } finally {
      setSavingTask(false);
    }
  };

  const handleAddProject = async (newProjectName: string) => {
    const newProject = {
      id: uuidv4(),
      projectName: newProjectName
    };
    setSavingProject(true);

    try {
      const addedProject = await apiRequest<ProjectsData, ProjectsData>(
        'POST',
        `${API_BASE_URL}${API_ROUTES.PROJECTS}`,
        newProject
      );

      setProjects((prevProjects) => [...prevProjects, addedProject]);
      setProjectModalOpen(false);
    } catch (error) {
      console.error('Failed to add new project', error);
    } finally {
      setSavingProject(false);
    }
  };

  const renderTaskDashboard = () => {
    return (
      <div className="bg-white mt-4 h-96 border-customBorder">
        <TaskDashboard
          selectedUserId={selectedUserId}
          onTaskRowSelected={handleTaskRowSelected}
          sourceComponent={sourceComponent}
          updateEarningsForUsers={updateEarningsForUsers}
          updateEarningsOnStatusChange={updateEarningsOnStatusChange}
          registerGridApiTaskDashboard={registerGridApiTaskDashboard}
          isLoading={isLoading}
          isSavingTask={isSavingTask}
          isSavingProject={isSavingProject}
          isSavingUser={isSavingUser}
          setSavingTask={setSavingTask}
        />
      </div>
    )
  };

  const renderUserListDrawer = () => {
    return (
      <div className="flex-grow-0 ml-1 mr-4 my-4 w-64 ag-theme-alpine overflow-auto">
        <UserListDrawer
          selectedUserId={selectedUserId}
          onUserSelected={handleUserRowSelected}
          sourceComponent={sourceComponent}
          registerGridApi={registerGridApi}
          onUserDoubleClicked={handleUserDoubleClicked}
          isLoading={isLoading}
          isSavingUser={isSavingUser}
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
      title='Add Project'
      onClose={() => setProjectModalOpen(false)}
      content={
        <Suspense fallback={<Spinner />}>
          <ProjectForm
            onClose={() => setProjectModalOpen(false)}
            onSubmit={handleAddProject}
          />
        </Suspense>
      }
    />
  );

  const renderTaskForm = () => (
    <ModalDialog
      title='Add Task'
      onClose={() => setTaskModalOpen(false)}
      content={
        <Suspense fallback={<Spinner />}>
          <TaskForm
            onClose={() => setTaskModalOpen(false)}
            onSubmit={handleAddNewTask}
          />
        </Suspense>
      }
    />
  );

  const renderUserProfileForm = () => {
    const title = isEditUser ? 'Edit User' : 'Add User';
    const buttonLabel = isEditUser ? 'Save' : 'Add';

    return (
      <ModalDialog
        title={title}
        onClose={() => setModalOpen(false)}
        content={
          <Suspense fallback={<Spinner />}>
            <UserProfileForm
              defaultValues={defaultValues}
              isEditUser={isEditUser}
              onClose={() => setModalOpen(false)}
              onSubmit={handleOnSubmit}
              buttonLabel={buttonLabel}
            />
          </Suspense>
        }
      />
    );
  };

  const renderChartAndTaskContent = () => {
    return (
      <div className="flex-grow bg-slate-100 my-4 mr-4 overflow-auto">
        <ErrorBoundary>
          <ChartTotalTasksCompleted
            isLoading={isLoading}
            isSavingTask={isSavingTask}
          />
        </ErrorBoundary>
        <div className="flex flex-row bg-slate-100 mt-4 h-[302px]">
          <ErrorBoundary>
            <ChartIndividualEmployeeProgress
              selectedUserId={selectedUserId}
              isLoading={isLoading}
              isSavingTask={isSavingTask}
              isSavingUser={isSavingUser}
            />
          </ErrorBoundary>
          <ErrorBoundary>
            <ChartTotalTasksByProjects
              isLoading={isLoading}
              isSavingTask={isSavingTask}
              isSavingProject={isSavingProject}
            />
          </ErrorBoundary>
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

  const contextValue = useMemo(() => ({
    users,
    tasks,
    projects,
    setUsers,
    setTasks,
    setProjects
  }), [users, tasks, projects, setUsers, setTasks, setProjects]);

  return (
    <DashboardContext.Provider value={contextValue}>
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
    </DashboardContext.Provider>
  );
};

export default Dashboard;
