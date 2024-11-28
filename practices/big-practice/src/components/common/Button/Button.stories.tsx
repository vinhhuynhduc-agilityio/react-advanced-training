import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/common/Button';

// Metadata for story
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    onClick: { action: 'clicked' },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

// Specific stories
export const Default: Story = {
  args: {
    label: 'Default Button',
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled Button',
    disabled: true,
  },
};

export const CustomLabel: Story = {
  args: {
    label: 'Custom Label',
    disabled: false,
  },
};
