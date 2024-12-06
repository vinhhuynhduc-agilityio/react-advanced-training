import type { Meta, StoryObj } from '@storybook/react';
import { PersonRenderer } from '.';
import { ICellRendererParams } from 'ag-grid-community';

// Mock Data
const mockUserData = {
  fullName: 'Joe Bloggs',
  earnings: '$11,500',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
};

// Metadata for Storybook
const meta: Meta<typeof PersonRenderer> = {
  title: 'Components/PersonRenderer',
  component: PersonRenderer,
  parameters: {
    layout: 'centered', // Center the component in the preview area
    docs: {
      description: {
        component: 'A custom cell renderer for AG Grid that displays user information, including an avatar, name, and earnings.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    data: {
      description: 'User data object to be rendered in the cell. Must contain `avatarUrl`, `fullName`, and `earnings`.',
      control: 'object',
      defaultValue: mockUserData,
    },
  },
};

export default meta;

type Story = StoryObj<typeof PersonRenderer>;

// Default Story for PersonRenderer with mock data
export const Default: Story = {
  args: {
    data: mockUserData, // Pass the mock user data
  } as ICellRendererParams,
};
