import { FieldType } from "@/types/fieldEnums";
import {
  FieldValue,
  ProjectsData,
  StatusWithDate,
  TaskData,
  UserData
} from "@/types/table";

export const getUpdatedRow = (
  type: FieldType,
  value: FieldValue,
  row: TaskData
): TaskData => {
  switch (type) {
    case FieldType.PROJECT: {
      const { projectName, id } = value as ProjectsData;

      return {
        ...row,
        projectName,
        projectId: id,
      };
    }

    case FieldType.USER: {
      const { fullName, id } = value as UserData;

      return {
        ...row,
        fullName,
        userId: id,
      };
    }

    case FieldType.TASK_NAME:

      return {
        ...row,
        taskName: value as string,
      };

    case FieldType.STATUS: {
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
