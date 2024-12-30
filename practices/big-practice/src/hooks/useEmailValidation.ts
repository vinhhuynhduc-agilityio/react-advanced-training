import { UserData } from "@/types";

export const useEmailValidation = (defaultEmail: string) => {

  const isEmailDuplicate = (email: string, users: UserData[]) => {
    return users.some(
      (user) => user.email === email && user.email !== defaultEmail
    );
  };

  return { isEmailDuplicate };
};
