export interface optionDropdown {
  id: string;
  value: string;
};

export interface TaskFormDataTest {
  currency: string;
  taskName: string;
  project: optionDropdown;
  user: optionDropdown;
};
