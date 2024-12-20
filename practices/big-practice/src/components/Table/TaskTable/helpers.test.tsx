
import { FIELD_TYPE } from "@/constant";
import { ProjectsData, TaskData, UserData } from "@/types";
import { handleProjectChange, handleStatusChange, handleTaskNameChange, handleUserChange } from "./helpers";

describe("Task Handlers", () => {
  let mockSetTasks: jest.Mock;
  let mockHandleSaveSelect: jest.Mock;
  let mockUpdateEarningsForUsers: jest.Mock;
  let mockUpdateEarningsOnStatusChange: jest.Mock;

  beforeEach(() => {
    mockSetTasks = jest.fn();
    mockHandleSaveSelect = jest.fn();
    mockUpdateEarningsForUsers = jest.fn();
    mockUpdateEarningsOnStatusChange = jest.fn();
  });

  const mockTask: TaskData = {
    id: "task-1",
    taskName: "Test Task",
    userId: "user-1",
    projectId: "project-1",
    projectName: "Test Project",
    fullName: "John Doe",
    status: false,
    completedDate: "incomplete",
    currency: 100,
    startDate: "01 Jan 2024",
  };

  const mockProject: ProjectsData = {
    id: "project-2",
    projectName: "New Project",
  };

  const mockUser: UserData = {
    id: "user-2",
    fullName: "Jane Smith",
    email: "jane@example.com",
    avatarUrl: "",
    earnings: "$200",
    registered: "",
    lastUpdated: "",
  };

  it("should handle task name change", async () => {
    const originalTaskNameRef = { current: "Old Task Name" };
    await handleTaskNameChange("New Task Name", mockTask, originalTaskNameRef, mockHandleSaveSelect);

    expect(mockHandleSaveSelect).toHaveBeenCalledWith(
      FIELD_TYPE.TASK_NAME,
      "New Task Name",
      mockTask
    );
    expect(mockHandleSaveSelect).toHaveBeenCalledTimes(1);
  });

  it("should handle project change", async () => {
    await handleProjectChange(mockProject, mockTask, mockSetTasks, mockHandleSaveSelect);

    expect(mockHandleSaveSelect).toHaveBeenCalledWith(FIELD_TYPE.PROJECT, mockProject, mockTask);
    expect(mockHandleSaveSelect).toHaveBeenCalledTimes(1);

    expect(mockSetTasks).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should handle project change", async () => {
    const project = {
      id: "project-1",
      projectName: "New Project",
    };
    await handleProjectChange(project, mockTask, mockSetTasks, mockHandleSaveSelect);
  });

  it("should handle user change", async () => {
    await handleUserChange(
      mockUser,
      mockTask,
      mockSetTasks,
      mockUpdateEarningsForUsers,
      mockHandleSaveSelect
    );

    expect(mockHandleSaveSelect).toHaveBeenCalledWith(FIELD_TYPE.USER, mockUser, mockTask);
    expect(mockHandleSaveSelect).toHaveBeenCalledTimes(1);

    expect(mockUpdateEarningsForUsers).toHaveBeenCalledWith(
      mockTask.userId,
      mockUser.id,
      mockTask.currency,
      mockTask.status
    );
    expect(mockUpdateEarningsForUsers).toHaveBeenCalledTimes(1);

    expect(mockSetTasks).toHaveBeenCalledWith(expect.any(Function));
  });

  it("should handle user change", async () => {
    const user = {
      id: "user-1",
      fullName: "Jane Smith",
      email: "jane@example.com",
      avatarUrl: "",
      earnings: "$200",
      registered: "",
      lastUpdated: "",
    }
    await handleUserChange(
      user,
      mockTask,
      mockSetTasks,
      mockUpdateEarningsForUsers,
      mockHandleSaveSelect
    );
  });

  it("should handle status change", async () => {
    const newStatus = true;
    await handleStatusChange(
      newStatus,
      mockTask,
      mockSetTasks,
      mockUpdateEarningsOnStatusChange,
      mockHandleSaveSelect
    );

    expect(mockHandleSaveSelect).toHaveBeenCalledWith(
      FIELD_TYPE.STATUS,
      expect.objectContaining({ status: newStatus, completedDate: expect.any(String) }),
      mockTask
    );
    expect(mockHandleSaveSelect).toHaveBeenCalledTimes(1);

    expect(mockUpdateEarningsOnStatusChange).toHaveBeenCalledWith(
      mockTask.userId,
      mockTask.currency,
      newStatus
    );
    expect(mockUpdateEarningsOnStatusChange).toHaveBeenCalledTimes(1);

    expect(mockSetTasks).toHaveBeenCalledWith(expect.any(Function));
  });
});
