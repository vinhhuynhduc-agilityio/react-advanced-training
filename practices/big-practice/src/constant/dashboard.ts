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

export {
  initialDefaultValues,
  defaultAvatarUrl
};
