interface optionDropdown {
  id: string;
  value: string;
};

export interface TaskFormValues {
  currency: string;
  taskName: string;
  project: optionDropdown;
  user: optionDropdown;
};
