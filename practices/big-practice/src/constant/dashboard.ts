import { UserData } from '@/types/table';

const initialDefaultValues: UserData = {
  fullName: '',
  email: '',
  avatarUrl: 'https://via.placeholder.com/80',
  id: '',
  earnings: '',
  registered: '',
  lastUpdated: ''
};

const defaultAvatarUrl = 'https://via.placeholder.com/80';

export {
  initialDefaultValues,
  defaultAvatarUrl
};
