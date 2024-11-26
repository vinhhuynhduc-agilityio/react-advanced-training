import type { Meta, StoryObj } from '@storybook/react';
import Spinner from '.';

// Metadata
const meta: Meta<typeof Spinner> = {
  title: 'Components/Spinner',
  component: Spinner,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

// Default story
export const Default: Story = {
  args: {},
};
