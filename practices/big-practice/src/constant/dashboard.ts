import { UserData } from '@/types/table';

const defaultAvatarUrl = 'https://via.placeholder.com/80';

const initialDefaultValues: UserData = {
  fullName: '',
  email: '',
  avatarUrl: defaultAvatarUrl,
  id: '',
  earnings: '',
  registered: '',
  lastUpdated: ''
};

const FIELD_TYPE = {
  PROJECT: "project",
  USER: "user",
  TASK_NAME: "taskName",
  STATUS: "status",
};

export {
  initialDefaultValues,
  defaultAvatarUrl,
  FIELD_TYPE
};
