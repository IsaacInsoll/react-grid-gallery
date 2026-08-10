import type { Meta, StoryObj } from '@storybook/react-vite';
import { GalleryWorkshop } from './GalleryWorkshop.example';
import galleryWorkshopSource from './GalleryWorkshop.example.tsx?raw';

const meta = {
  title: 'Examples/Gallery workshop',
  component: GalleryWorkshop,
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The complete starting point: compare justified and masonry layouts, choose a useful thumbnail size, repeat the local collection from 1–50 items, turn controlled selection on, and open optimized thumbnails as original-resolution YARL slides.',
      },
      source: {
        code: galleryWorkshopSource,
        language: 'tsx',
      },
    },
  },
} satisfies Meta<typeof GalleryWorkshop>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ExploreTheGallery: Story = {};
