import { Spinner } from '@/components/common';
import type { Meta, StoryObj } from '@storybook/react';

// Metadata cho story
const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A loading spinner component that can be customized with different border colors.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    borderColor: {
      description: 'Sets the color of the top border of the spinner. Default is blue (`border-t-blue-500`).',
      control: 'text',
      defaultValue: 'border-t-blue-500',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    borderColor: 'border-t-blue-500',
  },
};

export const RedBorder: Story = {
  args: {
    borderColor: 'border-t-red-500',
  },
};
