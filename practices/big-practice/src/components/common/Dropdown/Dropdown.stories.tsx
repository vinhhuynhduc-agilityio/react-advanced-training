import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from '@/components/common/Dropdown';

// Mock Data
const mockOptions = [
  { id: '1', value: 'Option 1' },
  { id: '2', value: 'Option 2' },
  { id: '3', value: 'Option 3' },
  { id: '4', value: 'Option 4' },
  { id: '5', value: 'Option 5' },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onSelect: { action: 'Option selected' },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

// Story default
export const Default: Story = {
  args: {
    options: mockOptions,
    placeholder: 'Select an option...',
  },
};

// Story with big data
export const LargeDataSet: Story = {
  args: {
    options: Array.from({ length: 50 }, (_, i) => ({
      id: `${i + 1}`,
      value: `Option ${i + 1}`,
    })),
    placeholder: 'Select an option (Large List)...',
  },
};

// Story when a value has been pre-selected
export const PreSelectedValue: Story = {
  render: (args) => {
    const preSelectedOption = mockOptions[1];
    return (
      <Dropdown
        {...args}
        onSelect={args.onSelect}
        options={mockOptions}
        placeholder="Select an option..."
        ref={(ref) => {
          if (ref) {
            ref.value = preSelectedOption.value;
          }
        }}
      />
    );
  },
  args: {
    options: mockOptions,
    placeholder: 'Pre-selected option...',
  },
};
