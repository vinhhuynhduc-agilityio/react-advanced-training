interface optionDropdown {
  id: string;
  value: string;
};

export interface TaskFormData {
  currency: string;
  taskName: string;
  project: optionDropdown;
  user: optionDropdown;
};
