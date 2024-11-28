import type { Meta, StoryObj } from '@storybook/react';
import { Header } from '@/components/Header';

// Metadata for story
const meta: Meta<typeof Header> = {
  title: 'Components/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    onAddUser: { action: 'Add User Clicked' },
    onAddProject: { action: 'Add Project Clicked' },
    onAddTask: { action: 'Add Task Clicked' },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

// Story default
export const Default: Story = {};
