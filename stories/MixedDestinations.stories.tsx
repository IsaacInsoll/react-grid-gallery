import type { Meta, StoryObj } from '@storybook/react-vite';
import { MixedDestinations } from './MixedDestinations.example';
import mixedDestinationsSource from './MixedDestinations.example.tsx?raw';

const meta = {
  title: 'Examples/Mixed destinations',
  component: MixedDestinations,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'Mix native album links, application-owned viewer actions, and an external video poster in one gallery. No player or third-party resource is loaded until a user deliberately follows the YouTube link.',
      },
      source: {
        code: mixedDestinationsSource,
        language: 'tsx',
      },
    },
  },
} satisfies Meta<typeof MixedDestinations>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PhotosAlbumsAndVideo: Story = {};
