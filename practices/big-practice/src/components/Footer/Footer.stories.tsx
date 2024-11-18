import type { Meta, StoryObj } from '@storybook/react';
import Footer from './Footer';

// Metadata cho story
const meta: Meta<typeof Footer> = {
  title: 'Components/Footer',
  component: Footer,
  tags: ['autodocs'], 
  argTypes: {
    content: { control: 'text' }, 
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {
  args: {
    content: 'Default Footer Content',
  },
};

export const CustomContent: Story = {
  args: {
    content: 'Custom Footer Content',
  },
};
