// types
import { FIELD_TYPE, FieldType } from '@/constant';
import {
  FieldValue,
  ProjectsData,
  StatusWithDate,
  TaskData,
  UserData
} from '@/types';

/**
 * Updates a row in the TaskData table based on the provided type and value.
 */
const getUpdatedRow = (
  type: FieldType,
  value: FieldValue,
  row: TaskData
): TaskData => {
  switch (type) {
    case FIELD_TYPE.PROJECT: {
      const { projectName, id } = value as ProjectsData;

      return {
        ...row,
        projectName,
        projectId: id,
      };
    }

    case FIELD_TYPE.USER: {
      const { fullName, id } = value as UserData;

      return {
        ...row,
        fullName,
        userId: id,
      };
    }

    case FIELD_TYPE.TASK_NAME:

      return {
        ...row,
        taskName: value as string,
      };

    case FIELD_TYPE.STATUS: {
      const { status, completedDate } = value as StatusWithDate;

      return {
        ...row,
        status,
        completedDate,
      };
    }

    default:
      return row;
  }
};

/**
 * Custom comparator function to sort dates.
 * @param date1 - The first date string in the format 'DD MMM YY'.
 * @param date2 - The second date string in the format 'DD MMM YY'.
 * @returns 1 if date1 is greater than date2, -1 otherwise.
 */
const getDateColumnSortComparator = (date1: string, date2: string) => {
  const parseDate = (dateStr: string) => {
    if (dateStr === 'incomplete') return null;
    const [day, month, year] = dateStr.split(' ');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return new Date(parseInt(year, 10), months.indexOf(month), parseInt(day, 10));
  };

  const dateObj1 = parseDate(date1);
  const dateObj2 = parseDate(date2);

  if (dateObj1 === null && dateObj2 === null) return 0;
  if (dateObj1 === null) return -1;
  if (dateObj2 === null) return 1;

  return dateObj1 > dateObj2
    ? 1
    : dateObj1 < dateObj2
      ? -1
      : 0;
};

const formatDropdownOptions = <T extends { id: string }>(
  data: T[],
  valueKey: keyof T
) =>
  data.map((item) => ({
    id: item.id,
    value: item[valueKey],
  }));

/**
 * Checks if a task name already exists in the task list.
 *
 * @param tasks - Array of existing tasks
 * @param value - New task name to check
 * @returns True if the task name already exists, otherwise false
 */
const isTaskDuplicate = (
  tasks: TaskData[],
  value: string
): boolean => {
  return tasks.some(
    task => task.taskName.toUpperCase() === value.toUpperCase()
  );
};


export {
  formatDropdownOptions,
  getUpdatedRow,
  getDateColumnSortComparator,
  isTaskDuplicate
};
