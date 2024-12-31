import React, {
  lazy,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState
} from 'react';
import { v4 as uuidv4 } from 'uuid';

// ag-grid
import { GridApi } from 'ag-grid-community';

// components
import {
  Modal,
  Footer,
  Header,
  TaskTable,
  ErrorBoundary,
  UsersTable,
} from '@/components';
const UserForm = lazy(() => import('@/components/Forms/UserForm'));
const TaskForm = lazy(() => import('@/components/Forms/TaskForm'));
const ProjectForm = lazy(() => import('@/components/Forms/ProjectForm'));
import { Spinner } from '@/components/common';
import {
  ChartIndividualEmployeeProgress,
  ChartTotalTasksByProjects,
  ChartTotalTasksCompleted
} from '@/components/Chart';

// types
import {
  UserFormData,
  ProjectsData,
  TaskData,
  UserData,
  TaskFormValues
} from '@/types';

// services
import { createProject, createTask, createUser, updateUser } from '@/services';

// constant
import {
  defaultAvatarUrl,
  defaultUserFormValues
} from '@/constant';

// helpers
import {
  formatStartDate,
  formatRegisteredDate,
} from '@/helpers';
import {
  calculateAdjustedEarnings,
  handleRowSelection,
  handleScrollingToAddedRow
} from '@/pages/Dashboard/helper';

// context
import { TasksContext } from '@/context';

// hooks
import {
  useFetchData,
  useRowSelection
} from '@/hooks';

const Dashboard: React.FC = () => {
  const userListGridApi = useRef<GridApi | null>(null);
  const taskDashboardGridApi = useRef<GridApi | null>(null);

  // State variables related to opening modal dialog
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditUser, setEditUser] = useState(false);
  const [defaultValues, setDefaultValues] = useState<UserData>(defaultUserFormValues);
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

  // Function to handle when row in TaskTable is selected.
  const handleTaskRowSelected = (userId: string | null) => {
    handleRowSelection(userId, 'TaskTable', handleRowSelected);
  };

  // Function to handle when row in UsersTable is selected
  const handleUserRowSelected = (userId: string | null) => {
    handleRowSelection(userId, 'UsersTable', handleRowSelected);
  };

  const updateEarningsForUsers = async (
    oldUserId: string,
    newUserId: string,
    currency: number,
    status: boolean
  ) => {
    handleTaskRowSelected(newUserId);

    if (!status) return;

    setSavingUser(true);

    const updates: Promise<{ data: UserData | null; error: Error | null }>[] = [];

    [oldUserId, newUserId].forEach((userId) => {
      const rowNode = userListGridApi.current!.getRowNode(userId);

      if (rowNode) {
        const adjustedEarnings = calculateAdjustedEarnings(
          rowNode.data.earnings,
          currency,
          userId !== oldUserId
        );

        const updatedData: UserData = {
          ...rowNode.data,
          earnings: `$${adjustedEarnings}`,
        };

        // Push the updateUser call to the updates array
        updates.push(updateUser(userId, updatedData));
      }
    });

    // Wait for all updates to complete
    const results = await Promise.all(updates);

    // Only update the data if all updates succeed
    results.forEach((result, index) => {
      if (result.error) {
        setSavingUser(false); // Stop saving and return early if there’s any error
        return;
      }

      const userId = [oldUserId, newUserId][index];
      const rowNode = userListGridApi.current!.getRowNode(userId);
      if (rowNode && result.data) {
        rowNode.setData(result.data);
      }
    });

    setSavingUser(false);
  };

  const updateEarningsOnStatusChange = async (
    userId: string,
    currency: number,
    status: boolean
  ) => {
    setSavingUser(true);

    // Retrieve `rowNode` by `userId` to update the specific row
    const rowNode = userListGridApi.current && userListGridApi.current.getRowNode(userId);

    if (rowNode) {
      const adjustedEarnings = calculateAdjustedEarnings(
        rowNode.data.earnings,
        currency,
        status
      );

      const updatedData: UserData = {
        ...rowNode.data,
        earnings: `$${adjustedEarnings}`,
      };

      // Call updateUser API
      const response = await updateUser(userId, updatedData);

      if (response.error) {
        setSavingUser(false);
        return;
      }

      // Update row data only if the API call is successful
      rowNode.setData(response.data);

      setSavingUser(false);
    }
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

  const handleToggleUserForm = useCallback(() => {
    setDefaultValues(defaultUserFormValues);
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
    const avatarUrl = data.avatarUrl ?? defaultAvatarUrl;
    const registeredDate = formatRegisteredDate();

    setSavingUser(true);

    const newUser: UserData = {
      id: uuidv4(),
      fullName: data.fullName,
      earnings: '$0',
      email: data.email,
      avatarUrl: avatarUrl,
      registered: registeredDate,
      lastUpdated: registeredDate,
    };

    // Call createUser API
    const response = await createUser(newUser);

    if (response.error) {
      setSavingUser(false);
      return;
    }

    // Add the new user to the state
    setUsers((prevUsers) => [...prevUsers, response.data!]);

    setModalOpen(false);

    // Handles scrolling to the new user
    if (userListGridApi.current) {
      handleScrollingToAddedRow(newUser.id, userListGridApi.current);
    }

    // Handle selection for the new user
    handleUserRowSelected(newUser.id);

    setSavingUser(false);
  };

  const handleEditUser = async (data: UserFormData) => {
    if (!defaultValues?.id) return;

    setSavingUser(true);

    const editUser: UserData = {
      id: defaultValues.id,
      fullName: data.fullName,
      earnings: defaultValues.earnings,
      email: data.email,
      avatarUrl: data.avatarUrl || defaultAvatarUrl,
      registered: defaultValues.registered,
      lastUpdated: formatRegisteredDate(),
    };

    // Call updateUser API
    const response = await updateUser(defaultValues.id, editUser);

    if (response.error) {
      setSavingUser(false);
      return;
    }

    // Update the users state with the updated user
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === defaultValues.id
          ? response.data!
          : user
      )
    );

    setModalOpen(false);
    setSavingUser(false);
  };

  const handleAddNewTask = async (data: TaskFormValues) => {
    const { currency, project, taskName, user } = data;
    const currencyValue = typeof currency === 'string' ? parseInt(currency, 10) : currency;

    setSavingTask(true);

    const newTask: TaskData = {
      id: uuidv4(),
      userId: user.id,
      projectId: project.id,
      taskName: taskName,
      startDate: formatStartDate(new Date()),
      completedDate: 'incomplete',
      currency: currencyValue,
      status: false,
      projectName: project.value,
      fullName: user.value,
    };

    const response = await createTask(newTask);

    if (response.error) {
      setSavingTask(false);
      return;
    }

    // If no error, update tasks state
    setTasks((prevTasks) => [...prevTasks, response.data!]);
    setTaskModalOpen(false);

    // Handles scrolling to new user
    if (taskDashboardGridApi.current) {
      handleScrollingToAddedRow(newTask.id, taskDashboardGridApi.current);
    }

    // Handle selected for new task
    handleTaskRowSelected(newTask.userId);

    setSavingTask(false);
  };

  const handleAddProject = async (newProjectName: string) => {
    const newProject: ProjectsData = {
      id: uuidv4(),
      projectName: newProjectName
    };

    setSavingProject(true);

    const response = await createProject(newProject);

    if (response.error) {
      setSavingProject(false);
      return;
    }

    // Update projects state with the new project
    setProjects((prevProjects) => [...prevProjects, response.data!]);
    setProjectModalOpen(false);

    setSavingProject(false);
  };

  const renderProjectForm = () => (
    <Modal
      title='Add Project'
      onClose={() => setProjectModalOpen(false)}
      content={
        <Suspense fallback={<Spinner />}>
          <ProjectForm
            onClose={() => setProjectModalOpen(false)}
            onSubmit={handleAddProject}
            projects={projects}
          />
        </Suspense>
      }
    />
  );

  const renderTaskForm = () => (
    <Modal
      title='Add Task'
      onClose={() => setTaskModalOpen(false)}
      content={
        <Suspense fallback={<Spinner />}>
          <TaskForm
            onClose={() => setTaskModalOpen(false)}
            onSubmit={handleAddNewTask}
            users={users}
            projects={projects}
            tasks={tasks}
          />
        </Suspense>
      }
    />
  );

  const renderUserForm = () => {
    const title = isEditUser ? 'Edit User' : 'Add User';
    const buttonLabel = isEditUser ? 'Save' : 'Add';

    return (
      <Modal
        title={title}
        onClose={() => setModalOpen(false)}
        content={
          <Suspense fallback={<Spinner />}>
            <UserForm
              defaultValues={defaultValues}
              isEditUser={isEditUser}
              onClose={() => setModalOpen(false)}
              onSubmit={handleOnSubmit}
              buttonLabel={buttonLabel}
              users={users}
            />
          </Suspense>
        }
      />
    );
  };

  const contextValue = useMemo(() => ({
    tasks,
    setTasks,
  }), [tasks, setTasks]);

  return (
    <TasksContext.Provider value={contextValue}>
      <div className="flex flex-col h-screen w-screen">
        <Header
          onAddUser={handleToggleUserForm}
          onAddProject={handleToggleProjectForm}
          onAddTask={handleToggleTaskForm}
          isLoading={isLoading}
          isSavingTask={isSavingTask}
          isSavingUser={isSavingUser}
          isSavingProject={isSavingProject}
        />
        <div className="flex flex-row flex-grow bg-slate-100 min-h-0">
          <div className="flex-grow-0 ml-1 mr-4 my-4 w-64 ag-theme-alpine overflow-auto">
            <UsersTable
              selectedUserId={selectedUserId}
              onUserSelected={handleUserRowSelected}
              sourceComponent={sourceComponent}
              registerGridApi={registerGridApi}
              onUserDoubleClicked={handleUserDoubleClicked}
              isLoading={isLoading}
              isSavingUser={isSavingUser}
              users={users}
            />
          </div>
          <div className="flex-grow bg-slate-100 my-4 mr-4 overflow-auto">
            <ErrorBoundary>
              <ChartTotalTasksCompleted
                isLoading={isLoading}
                tasks={tasks}
              />
            </ErrorBoundary>
            <div className="flex flex-row bg-slate-100 mt-4 h-[302px]">
              <ErrorBoundary>
                <ChartIndividualEmployeeProgress
                  selectedUserId={selectedUserId}
                  isLoading={isLoading}
                  users={users}
                  tasks={tasks}
                />
              </ErrorBoundary>
              <ErrorBoundary>
                <ChartTotalTasksByProjects
                  isLoading={isLoading}
                  projects={projects}
                  tasks={tasks}
                />
              </ErrorBoundary>
            </div>
            <div className="bg-white mt-4 h-96 border-customBorder">
              <TaskTable
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
                users={users}
                projects={projects}
              />
            </div>
          </div>
        </div>
        <Footer
          content='Team Progress App'
        />
      </div>
      {isModalOpen && renderUserForm()}
      {isProjectModalOpen && renderProjectForm()}
      {isTaskModalOpen && renderTaskForm()}
    </TasksContext.Provider>
  );
};

export default Dashboard;
