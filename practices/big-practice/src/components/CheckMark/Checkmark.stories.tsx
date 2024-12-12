import { CheckMark } from '@/components';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CheckMark> = {
  title: 'Components/CheckMark',
  component: CheckMark,
  parameters: {
    layout: 'centered', // Center the component in the preview area
    docs: {
      description: {
        component:
          'CheckMark component shows either a check or a clock icon based on the boolean value passed as `value`. It updates the displayed icon when the `value` changes.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    value: {
      description: 'Boolean value to determine which icon to display. `true` shows a check icon, `false` shows a clock icon.',
      control: 'boolean',
      defaultValue: true,
    },
    onStatusValueChange: {
      description: 'Callback function to handle status value changes when the icon is clicked.',
      action: 'clicked',
    },
  },
};

export default meta;

type Story = StoryObj<typeof CheckMark>;

// Story with default "complete" status (check icon)
export const Default: Story = {
  args: {
    value: true, // Default value to show the check icon
  },
};

// Story for incomplete status (clock icon)
export const Incomplete: Story = {
  args: {
    value: false, // Set to false to show the clock icon
  },
};
