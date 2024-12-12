import { Meta, StoryObj } from '@storybook/react';
import { Modal } from '.';

// Metadata for story
const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  argTypes: {
    onClose: { action: 'closed' },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

// Story default
export const Default: Story = {
  args: {
    title: 'Default Modal Title',
    content: <p style={{ color: 'black' }}>This is the modal body content.</p>,
    onClose: () => console.log('Modal closed'),
  },
};

// Story custom content
export const CustomContent: Story = {
  args: {
    title: 'Custom Content Modal',
    content: <div style={{ color: 'black' }}><h3>Custom Header</h3><p>Custom modal content goes here.</p></div>,
    onClose: () => console.log('Modal closed'),
  },
};
