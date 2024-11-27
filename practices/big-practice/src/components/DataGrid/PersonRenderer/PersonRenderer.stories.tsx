import type { Meta, StoryObj } from '@storybook/react';
import { PersonRenderer } from '.'; 
import { ICellRendererParams } from 'ag-grid-community';

// Mock Data
const mockUserData = {
  "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "fullName": "Joe Bloggs",
  "earnings": "$11500",
  "email": "john@example.com",
  "avatarUrl": "https://i.pravatar.cc/150?img=1",
  "registered": "May 21, 2020 17:02:06",
  "lastUpdated": "Nov 11, 2024 14:34:21"
};

// Metadata
const meta: Meta<typeof PersonRenderer> = {
  title: 'Components/PersonRenderer',
  component: PersonRenderer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof PersonRenderer>;

export const Default: Story = {
  args: {
    data: mockUserData,
  } as ICellRendererParams<typeof mockUserData>,
};
