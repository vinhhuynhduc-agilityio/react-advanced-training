import type { Meta, StoryObj } from '@storybook/react';
import { CustomCellEditorParams, DropdownCellEditor } from '@/components/DataGrid/DropdownCellEditor';
import { Column } from 'ag-grid-community';

const mockMultipleOptions = [
  {
    "id": "f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb",
    "projectName": "Support"
  },
  {
    "id": "c1c20a2e-f450-4875-96e8-334f92e9b3b5",
    "projectName": "Failure Testing"
  },
  {
    "id": "e38e56a2-4d3c-469d-8345-45d6b5fae9f9",
    "projectName": "Quality Management"
  },
  {
    "id": "f49b68f4-5e5b-457d-bf16-1b5b78e6f5f1",
    "projectName": "Data Quality"
  },
  {
    "id": "47c80c97-6575-45eb-a25b-75ee485bf9fb",
    "projectName": "Test"
  },
  {
    "id": "a34d18e0-b94e-49a2-b7ec-5e4d8321de75",
    "projectName": "Product Development"
  },
  {
    "id": "3a56f332-402f-4ef5-80f1-513a61ad5986",
    "projectName": "Marketing Campaign"
  },
  {
    "id": "9d8c7e89-c7e9-47ac-8b93-9c6c80f9a63f",
    "projectName": "Sales Strategy"
  },
  {
    "id": "cc8f7989-6e7d-490a-8ff7-d9d1e0bc9c10",
    "projectName": "Client Support"
  },
  {
    "id": "5d720193-b378-48f0-b0e2-f13243c5b074",
    "projectName": "Compliance"
  },
  {
    "id": "b19a4e29-5e67-420b-9180-d3e3c5cd56c7",
    "projectName": "Business Intelligence"
  },
  {
    "id": "672a7d7e-44d1-4c1b-8b23-9b4f8b5b911b",
    "projectName": "Infrastructure"
  }
];

type Option = {
  id: string;
  projectName: string;
};

type Data = {
  id: number;
  name: string;
  currency: string;
  fullName: string;
};

const meta: Meta<typeof DropdownCellEditor> = {
  title: 'components/DropdownCellEditor',
  component: DropdownCellEditor,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'The DropdownCellEditor component provides a dropdown menu for editing cells within the ag-Grid. It allows users to select an option from a predefined list of values, making it easy to update cell content with consistent and standardized options. This is particularly useful for fields such as user assignments, project selection.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    options: {
      description: 'An array of options to display in the dropdown.',
      control: 'object',
    },
    displayKey: {
      description: 'The key used to display the option values in the dropdown.',
      control: 'text',
    },
    onSelectOption: {
      description: 'Callback function that gets triggered when an option is selected.',
      action: 'selected',
    },
    data: {
      description: 'The current row data for the cell being edited.',
      control: 'object',
    },
    column: {
      description: 'The column details for the cell being edited.',
      control: 'object',
    },
    eGridCell: {
      description: 'The DOM element for the cell being edited.',
      control: 'object',
    },
    stopEditing: {
      description: 'Function to stop editing the current cell.',
      action: 'editing stopped',
    },
  },
};

export default meta;

type Story = StoryObj<CustomCellEditorParams<Option, Data>>;

export const SmallList: Story = {
  args: {
    options: mockMultipleOptions.slice(0, 3),
    displayKey: 'projectName',
    onSelectOption: (value: Option, data: Data) => console.log('Selected option:', value, 'with data:', data),
    data: { id: 1, name: 'Option 1' },
    column: {
      getColId: () => 'name',
      getActualWidth: () => 200,
    } as Column,
    eGridCell: document.createElement('div'),
    stopEditing: () => console.log('Editing stopped'),
  },
};

export const LargeList: Story = {
  args: {
    options: mockMultipleOptions,
    displayKey: 'projectName',
    onSelectOption: (value: Option, data: Data) => console.log('Selected option:', value, 'with data:', data),
    data: { id: 1, name: 'Option 1' },
    column: {
      getColId: () => 'name',
      getActualWidth: () => 200,
    } as Column,
    eGridCell: document.createElement('div'),
    stopEditing: () => console.log('Editing stopped'),
  },
};