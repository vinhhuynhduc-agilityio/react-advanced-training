import { FieldValue, ProjectsData, TaskData, UserData } from "@/types";

export const handleTaskNameChange = (
  value: FieldValue,
  originalTaskNameRef: React.MutableRefObject<string>
) => {
  const currentValue = originalTaskNameRef.current;
  const newValue = value;

  if (newValue === currentValue) return { isValidChange: false };

  return {
    newValue,
    customValue: newValue,
    isValidChange: true
  };
};

export const handleProjectChange = (
  value: FieldValue,
  row: TaskData,
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>
) => {
  const currentValue = row.projectId;
  const newValue = (value as ProjectsData).id;

  if (newValue === currentValue) return { isValidChange: false };

  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === row.id
        ? {
          ...task,
          projectId: newValue,
          projectName: (value as ProjectsData).projectName,
        }
        : task
    )
  );

  return {
    newValue,
    customValue: value,
    isValidChange: true
  };
};

export const handleUserChange = (
  value: FieldValue,
  row: TaskData,
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>,
  updateEarningsForUsers: (
    oldUserId: string,
    newUserId: string,
    currency: number,
    status: boolean
  ) => void
) => {
  const { userId, currency, status } = row;
  const oldUserId = userId;
  const newUserId = (value as UserData).id;
  const currentValue = row.userId;

  if (newUserId === currentValue) return { isValidChange: false };

  if (oldUserId !== newUserId) {
    updateEarningsForUsers(oldUserId, newUserId, currency, status);
  }

  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === row.id
        ? {
          ...task,
          userId: newUserId,
          fullName: (value as UserData).fullName,
        }
        : task
    )
  );

  return {
    newValue: newUserId,
    customValue: value,
    isValidChange: true
  };
};

export const handleStatusChange = (
  value: FieldValue,
  row: TaskData,
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>,
  updateEarningsOnStatusChange: (
    userId: string,
    currency: number,
    status: boolean
  ) => void
) => {
  const status = value as boolean;
  const { currency, userId } = row;
  const completedDate = status
    ? new Date().toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: '2-digit',
    } as Intl.DateTimeFormatOptions)
    : 'incomplete';

  const newValue = { status, completedDate };

  updateEarningsOnStatusChange(userId, currency, status);

  setTasks((prevTasks) =>
    prevTasks.map((task) =>
      task.id === row.id
        ? {
          ...task,
          status,
          completedDate,
        }
        : task
    )
  );

  return {
    newValue,
    customValue: newValue,
    isValidChange: true
  };
};
