import { FieldType } from "@/types/fieldEnums";
import {
  ProjectsData,
  TaskData,
  UserData
} from "@/types/table";

export const getUpdatedRow = (
  type: FieldType,
  value: ProjectsData | UserData | string,
  row: TaskData
): TaskData => {
  const updateHandlers = {
    project: () => {
      const {
        projectName,
        id
      } = value as ProjectsData;

      return {
        ...row,
        projectName,
        projectId: id
      };
    },
    user: () => {
      const {
        fullName,
        id
      } = value as UserData;

      return {
        ...row,
        fullName,
        userId: id
      };
    },
    taskName: () => ({
      ...row,
      taskName: value as string
    })
  };

  return updateHandlers[type]?.() || row;
};
