import { useDashboardContext } from '@/hooks';

export const useEmailValidation = (defaultEmail: string) => {
  const { users } = useDashboardContext();

  const isEmailDuplicate = (email: string) => {
    return users.some(
      (user) => user.email === email && user.email !== defaultEmail
    );
  };

  return { isEmailDuplicate };
};
