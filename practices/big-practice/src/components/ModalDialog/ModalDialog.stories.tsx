import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';

// components
import { ModalDialog } from '@/components/ModalDialog';
import { TaskForm } from '@/components/TaskForm';

// Mock Data
const mockUsers = [
  {
    id: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    fullName: 'Joe Bloggs',
    earnings: '$11500',
    email: 'john@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    registered: 'May 21, 2020 17:02:06',
    lastUpdated: 'Nov 11, 2024 14:34:21',
  },
  {
    id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    fullName: 'Jane Smith',
    earnings: '$35800',
    email: 'jane@example.com',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    registered: 'June 10, 2021 09:20:15',
    lastUpdated: 'October 15, 2023 09:45:00',
  },
];

const mockProjects = [
  { id: 'f2d32cb6-12c7-4ae7-bb28-74f16d1d2cbb', projectName: 'Support' },
  { id: 'c1c20a2e-f450-4875-96e8-334f92e9b3b5', projectName: 'Failure Testing' },
];

const mockTasks = [
  {
    id: '71e564f4-7c18-47f7-89f2-abe4b7ec2854',
    userId: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    projectId: 'c1c20a2e-f450-4875-96e8-334f92e9b3b5',
    taskName: 'Build test',
    startDate: '10 Aug 24',
    completedDate: '15 Nov 24',
    currency: 2000,
    status: true,
    projectName: 'Failure Testing',
    fullName: 'Joe Bloggs',
  },
  {
    id: '0f9fd8b0-8f5c-4a25-b301-eebc6d5700d5',
    userId: '123e4567-e89b-12d3-a456-426614174001',
    projectId: 'e38e56a2-4d3c-469d-8345-45d6b5fae9f9',
    taskName: 'Develop Backend',
    startDate: '01 Sep 24',
    completedDate: '15 Nov 24',
    currency: 5000,
    status: true,
    projectName: 'Quality Management',
    fullName: 'Bob White',
  },
];

// Metadata
const meta: Meta<typeof ModalDialog> = {
  title: 'Components/ModalDialog',
  component: ModalDialog,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ModalDialog>;

// Story showing ModalDialog with TaskForm
export const WithTaskForm: Story = {
  args: {
    title: 'Add Task',
    onClose: action('Modal closed'),
    content: (
      <TaskForm
        onClose={action('Form closed')}
        onSubmit={action('Form submitted')}
        tasks={mockTasks}
        projects={mockProjects}
        users={mockUsers}
      />
    ),
  },
};
