export interface RowData {
  pk_user: string;
  full_name: string;
  earnings: string;
  email: string;
  avatar_url: string;
  registered: string;
  last_updated: string;
};

export interface UserListDrawerProps {
  users: RowData[];
};
