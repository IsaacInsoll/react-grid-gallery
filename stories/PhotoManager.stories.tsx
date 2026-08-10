import type { Meta, StoryObj } from '@storybook/react-vite';
import { PhotoManager } from './PhotoManager.example';
import photoManagerSource from './PhotoManager.example.tsx?raw';

const meta = {
  title: 'Examples/Photo manager',
  component: PhotoManager,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A product-level asset library: filter typed image records, control individual and shift-range selection, perform bulk actions, and open original-resolution files in YARL.',
      },
      source: {
        code: photoManagerSource,
        language: 'tsx',
      },
    },
  },
} satisfies Meta<typeof PhotoManager>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WorkingLibrary: Story = {};
