import type { Meta, StoryObj } from '@storybook/react';
import { CustomCellEditorParams, DropdownCellEditor } from '@/components/DataGrid/DropdownCellEditor';
import { Column } from 'ag-grid-community';
import { UserData } from '@/types';

const mockMultipleOptions = [
  {
    "id": "d290f1ee-6c54-4b01-90e6-d701748f0851",
    "fullName": "Joe Bloggs",
    "earnings": "$12600",
    "email": "john@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=1",
    "registered": "May 21, 2020 17:02:06",
    "lastUpdated": "Nov 11, 2024 14:34:21"
  },
  {
    "id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
    "fullName": "Jane Smith",
    "earnings": "$33811",
    "email": "jane@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=2",
    "registered": "June 10, 2021 09:20:15",
    "lastUpdated": "Nov 18, 2024 17:33:37"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "fullName": "Alice Brown",
    "earnings": "$12200",
    "email": "alice@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=3",
    "registered": "April 15, 2020 14:02:06",
    "lastUpdated": "October 11, 2023 10:00:00"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174001",
    "fullName": "Bob White",
    "earnings": "$8900",
    "email": "bob@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=4",
    "registered": "March 21, 2021 08:40:00",
    "lastUpdated": "October 12, 2023 16:25:00"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174002",
    "fullName": "Charlie Black",
    "earnings": "$10000",
    "email": "charlie@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=5",
    "registered": "July 5, 2020 09:10:10",
    "lastUpdated": "October 13, 2023 15:15:15"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174003",
    "fullName": "David Green",
    "earnings": "$8800",
    "email": "david@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=6",
    "registered": "May 21, 2021 11:12:13",
    "lastUpdated": "October 14, 2023 08:55:05"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174004",
    "fullName": "Eve Blue",
    "earnings": "$9200",
    "email": "eve@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=7",
    "registered": "June 30, 2021 10:11:12",
    "lastUpdated": "October 16, 2023 11:45:50"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174005",
    "fullName": "Frank Gray",
    "earnings": "$9200",
    "email": "frank@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=8",
    "registered": "August 12, 2020 13:15:30",
    "lastUpdated": "October 12, 2023 16:30:45"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174006",
    "fullName": "Grace Yellow",
    "earnings": "$6600",
    "email": "grace@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=9",
    "registered": "February 20, 2021 12:20:30",
    "lastUpdated": "October 14, 2023 17:22:05"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174007",
    "fullName": "Hank Violet",
    "earnings": "$5400",
    "email": "hank@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=10",
    "registered": "January 10, 2021 14:25:15",
    "lastUpdated": "October 11, 2023 12:35:30"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174008",
    "fullName": "Ivy Red",
    "earnings": "$6700",
    "email": "ivy@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=11",
    "registered": "December 1, 2020 15:30:00",
    "lastUpdated": "October 13, 2023 13:40:45"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174009",
    "fullName": "Jack Orange",
    "earnings": "$5800",
    "email": "jack@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=12",
    "registered": "April 18, 2020 16:35:20",
    "lastUpdated": "October 16, 2023 18:50:05"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174010",
    "fullName": "Karen Indigo",
    "earnings": "$8600",
    "email": "karen@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=13",
    "registered": "March 9, 2021 17:40:10",
    "lastUpdated": "October 15, 2023 19:55:30"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174011",
    "fullName": "Leo Pink",
    "earnings": "$12400",
    "email": "leo@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=14",
    "registered": "November 5, 2020 18:45:05",
    "lastUpdated": "October 10, 2023 10:15:45"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174012",
    "fullName": "Mia Teal",
    "earnings": "$8600",
    "email": "mia@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=15",
    "registered": "August 17, 2020 19:50:00",
    "lastUpdated": "October 14, 2023 14:20:05"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174013",
    "fullName": "Nick Maroon",
    "earnings": "$11900",
    "email": "nick@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=16",
    "registered": "July 8, 2021 20:55:15",
    "lastUpdated": "October 12, 2023 15:35:00"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174014",
    "fullName": "Olivia Magenta",
    "earnings": "$11800",
    "email": "olivia@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=17",
    "registered": "February 14, 2021 21:00:45",
    "lastUpdated": "October 15, 2023 16:40:30"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174015",
    "fullName": "Paul Silver",
    "earnings": "$9800",
    "email": "paul@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=18",
    "registered": "June 22, 2020 22:05:50",
    "lastUpdated": "October 16, 2023 14:25:15"
  },
  {
    "id": "123e4567-e89b-12d3-a456-426614174016",
    "fullName": "Quincy Gold",
    "earnings": "$11400",
    "email": "quincy@example.com",
    "avatarUrl": "https://i.pravatar.cc/150?img=19",
    "registered": "May 13, 2021 23:10:05",
    "lastUpdated": "October 14, 2023 10:50:20"
  }
];

const mockData = {
  "id": "71e564f4-7c18-47f7-89f2-abe4b7ec2854",
  "userId": "d290f1ee-6c54-4b01-90e6-d701748f0851",
  "projectId": "c1c20a2e-f450-4875-96e8-334f92e9b3b5",
  "taskName": "Build test",
  "startDate": "10 Aug 24",
  "completedDate": "15 Nov 24",
  "currency": 2000,
  "status": true,
  "fullName": "Failure Testing",
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
  decorators: [
    (Story: React.FC) => (
      <div
        style={{
          position: 'relative',
          width: '200px',
          height: '290px',
        }}
      >
        <Story />
      </div>
    )
  ],
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
    showAvatar: {
      description: 'Determines whether avatars are displayed alongside options.',
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<CustomCellEditorParams<UserData, Data>>;

export const SmallList: Story = {
  args: {
    options: mockMultipleOptions.slice(0, 3),
    displayKey: 'fullName',
    onSelectOption: (value: UserData, data: Data) => console.log('Selected option:', value, 'with data:', data),
    data: mockData,
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
    displayKey: 'fullName',
    onSelectOption: (value: UserData, data: Data) => console.log('Selected option:', value, 'with data:', data),
    data: mockData,
    column: {
      getColId: () => 'name',
      getActualWidth: () => 200,
    } as Column,
    eGridCell: document.createElement('div'),
    stopEditing: () => console.log('Editing stopped'),
  },
};

export const SmallListWithAvatars: Story = {
  args: {
    options: mockMultipleOptions.slice(0, 3).map((option, index) => ({
      ...option,
      avatarUrl: `https://i.pravatar.cc/150?img=${index + 1}`,
    })),
    displayKey: 'fullName',
    onSelectOption: (value: UserData, data: Data) => console.log('Selected option:', value, 'with data:', data),
    data: mockData,
    column: {
      getColId: () => 'name',
      getActualWidth: () => 200,
    } as Column,
    eGridCell: document.createElement('div'),
    stopEditing: () => console.log('Editing stopped'),
    showAvatar: true,
  },
};

export const LargeListWithAvatars: Story = {
  args: {
    options: mockMultipleOptions.map((option, index) => ({
      ...option,
      avatarUrl: `https://i.pravatar.cc/150?img=${index + 1}`,
    })),
    displayKey: 'fullName',
    onSelectOption: (value: UserData, data: Data) => console.log('Selected option:', value, 'with data:', data),
    data: mockData,
    column: {
      getColId: () => 'name',
      getActualWidth: () => 200,
    } as Column,
    eGridCell: document.createElement('div'),
    stopEditing: () => console.log('Editing stopped'),
    showAvatar: true,
  },
};

export const WithoutAvatars: Story = {
  args: {
    options: mockMultipleOptions,
    displayKey: 'fullName',
    onSelectOption: (value: UserData, data: Data) => console.log('Selected option:', value, 'with data:', data),
    data: mockData,
    column: {
      getColId: () => 'name',
      getActualWidth: () => 200,
    } as Column,
    eGridCell: document.createElement('div'),
    stopEditing: () => console.log('Editing stopped'),
    showAvatar: false,
  },
};
