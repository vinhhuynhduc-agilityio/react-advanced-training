import {
  ProjectsData,
  TaskData,
  UserData
} from "@/types/table";

export const getUpdatedRow = (
  type: 'project' | 'user',
  value: ProjectsData | UserData,
  row: TaskData
): TaskData => {
  if (type === 'project') {
    const project = value as ProjectsData;
    return {
      ...row,
      projectName: project.projectName,
      projectId: project.id
    };
  }

  const user = value as UserData;
  return {
    ...row,
    fullName: user.fullName,
    userId: user.id
  };
};
