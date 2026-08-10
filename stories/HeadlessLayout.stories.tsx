import type { Meta, StoryObj } from '@storybook/react-vite';
import { HeadlessLayout } from './HeadlessLayout.example';
import headlessLayoutSource from './HeadlessLayout.example.tsx?raw';

const meta = {
  title: 'Advanced/Headless layout',
  component: HeadlessLayout,
  args: {
    containerWidth: 920,
    layout: 'justified',
  },
  argTypes: {
    layout: {
      control: 'inline-radio',
      options: ['justified', 'masonry'],
      description: 'Select the geometry helper used by the custom renderer.',
    },
    containerWidth: {
      control: { type: 'range', min: 480, max: 1040, step: 20 },
      description: 'Width passed directly to both layout helpers.',
    },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Use `buildLayout`, `buildLayoutFlat`, or `buildMasonryLayout` when you need Gallery geometry without Gallery tile markup. The same example reuses the exported `CheckButton` with a custom palette.',
      },
      source: {
        code: headlessLayoutSource,
        language: 'tsx',
      },
    },
  },
} satisfies Meta<typeof HeadlessLayout>;

export default meta;
type Story = StoryObj<typeof meta>;

export const CustomTiles: Story = {};

export const MasonryColumns: Story = {
  args: {
    layout: 'masonry',
  },
  parameters: {
    docs: {
      description: {
        story:
          '`buildMasonryLayout` returns balanced columns whose records retain their original index and application fields, allowing custom markup without losing callback identity.',
      },
    },
  },
};
