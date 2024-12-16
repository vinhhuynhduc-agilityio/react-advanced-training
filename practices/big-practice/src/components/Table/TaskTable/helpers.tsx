import { FIELD_TYPE, FieldType } from "@/constant";
import { FieldValue, ProjectsData, TaskData, UserData } from "@/types";

const handleTaskNameChange = (
  value: FieldValue,
  row: TaskData,
  originalTaskNameRef: React.MutableRefObject<string>,
  handleSaveSelect: (type: FieldType, value: FieldValue, row: TaskData) => void,
) => {
  const currentValue = originalTaskNameRef.current;
  const newValue = value;

  if (newValue === currentValue) return;

  handleSaveSelect(FIELD_TYPE.TASK_NAME as FieldType, newValue, row);
};

const handleProjectChange = (
  value: FieldValue,
  row: TaskData,
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>,
  handleSaveSelect: (type: FieldType, value: FieldValue, row: TaskData) => void
) => {
  const currentValue = row.projectId;
  const newValue = (value as ProjectsData).id;

  if (newValue === currentValue) return;

  handleSaveSelect(FIELD_TYPE.PROJECT as FieldType, value, row);

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
};

const handleUserChange = (
  value: FieldValue,
  row: TaskData,
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>,
  updateEarningsForUsers: (oldUserId: string, newUserId: string, currency: number, status: boolean) => void,
  handleSaveSelect: (type: FieldType, value: FieldValue, row: TaskData) => void
) => {
  const { userId, currency, status } = row;
  const oldUserId = userId;
  const newUserId = (value as UserData).id;

  if (newUserId === oldUserId) return;

  handleSaveSelect(FIELD_TYPE.USER as FieldType, value, row);
  updateEarningsForUsers(oldUserId, newUserId, currency, status);

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
};

const handleStatusChange = (
  value: FieldValue,
  row: TaskData,
  setTasks: React.Dispatch<React.SetStateAction<TaskData[]>>,
  updateEarningsOnStatusChange: (userId: string, currency: number, status: boolean) => void,
  handleSaveSelect: (type: FieldType, value: FieldValue, row: TaskData) => void
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

  handleSaveSelect(FIELD_TYPE.STATUS as FieldType, { status, completedDate }, row);
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
};

export {
  handleTaskNameChange,
  handleProjectChange,
  handleUserChange,
  handleStatusChange
};
