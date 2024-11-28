import { Meta, StoryObj } from '@storybook/react';
import { ModalDialog } from '.';

// Metadata for story
const meta: Meta<typeof ModalDialog> = {
  title: 'Components/ModalDialog',
  component: ModalDialog,
  argTypes: {
    onClose: { action: 'closed' },
  },
};

export default meta;

type Story = StoryObj<typeof ModalDialog>;

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
