import { Meta, StoryObj } from '@storybook/react';
import { Modal } from '.';

// Metadata for story
const meta: Meta<typeof Modal> = {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'The Modal component provides a customizable and accessible overlay modal. It displays a title, content, and a callback function to close the modal.',
      },
    },
  },
  tags: ['autodocs'],
  decorators: [
    (Story: React.FC) => (
      <div
        style={{
          position: 'relative',
          width: '710px',
          height: '440px',
        }}
      >
        <Story />
      </div>
    )
  ],
  argTypes: {
    title: {
      description: 'The title displayed in the modal header.',
      control: 'text',
    },
    content: {
      description: 'The content to be displayed inside the modal body.',
      control: 'object',
    },
    onClose: {
      description: 'Callback function triggered when the modal is closed.',
      action: 'closed',
    },
  },
};

export default meta;

type Story = StoryObj<typeof Modal>;

// Default story
export const Default: Story = {
  args: {
    title: 'Default Modal Title',
    content: <p style={{ color: 'black' }}>This is the modal body content.</p>,
    onClose: () => console.log('Modal closed'),
  },
};

// Story with custom content
export const CustomContent: Story = {
  args: {
    title: 'Custom Content Modal',
    content: (
      <div style={{ color: 'black' }}>
        <h3>Custom Header</h3>
        <p>Custom modal content goes here.</p>
      </div>
    ),
    onClose: () => console.log('Modal closed'),
  },
};

// Story with longer content
export const LongContent: Story = {
  args: {
    title: 'Modal with Long Content',
    content: (
      <div style={{ color: 'black' }}>
        <h3>Long Content Example</h3>
        <p>
          This is an example of a modal with longer content. Lorem ipsum dolor
          sit amet, consectetur adipiscing elit. Praesent euismod nisl non
          libero euismod, non cursus ligula fringilla. Ut sit amet felis vel
          sapien dictum volutpat. Pellentesque habitant morbi tristique
          senectus et netus et malesuada fames ac turpis egestas.
        </p>
        <p>
          Quisque nec nisl et orci pharetra feugiat non in leo. Aliquam erat
          volutpat. Nullam eget hendrerit est. Maecenas ullamcorper, ligula
          vitae accumsan elementum, risus justo egestas orci, id mollis quam
          ligula nec neque.
        </p>
      </div>
    ),
    onClose: () => console.log('Modal closed'),
  },
};
