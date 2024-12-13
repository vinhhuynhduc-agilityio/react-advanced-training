import type { Meta, StoryObj } from '@storybook/react';
import { PersonListItem } from '.';
import { ICellRendererParams } from 'ag-grid-community';

// Mock Data
const mockUserData = {
  fullName: 'Joe Bloggs',
  earnings: '$11,500',
  avatarUrl: 'https://i.pravatar.cc/150?img=1',
};

// Metadata for Storybook
const meta: Meta<typeof PersonListItem> = {
  title: 'Components/PersonListItem',
  component: PersonListItem,
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

type Story = StoryObj<typeof PersonListItem>;

// Default Story for PersonListItem with mock data
export const Default: Story = {
  args: {
    data: mockUserData, // Pass the mock user data
  } as ICellRendererParams,
};
