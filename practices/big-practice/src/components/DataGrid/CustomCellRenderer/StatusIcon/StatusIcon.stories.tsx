import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { IconRenderer } from './StatusIcon';

const meta: Meta<typeof IconRenderer> = {
  title: 'Components/IconRenderer',
  component: IconRenderer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onStatusValueChange: { action: 'Status changed' },
  },
};

export default meta;

type Story = StoryObj<typeof IconRenderer>;

// Story: Completed icon
export const Complete: Story = {
  args: {
    value: true,
  },
};

// Story: Icon not completed
export const Incomplete: Story = {
  args: {
    value: false,
  },
};
