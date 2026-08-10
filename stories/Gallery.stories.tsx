import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gallery } from '@picr/react-grid-gallery';
import { dogPhotos } from './gallery-data';
import { galleryArgTypes } from './gallery-arg-types';

const meta = {
  title: 'Gallery/Playground',
  component: Gallery,
  parameters: {
    docs: {
      description: {
        component:
          'Explore the primary package export with honest, working controls. Resize the canvas to see the gallery respond to its container.',
      },
    },
  },
  args: {
    images: dogPhotos,
    layout: 'justified',
    rowHeight: 190,
    margin: 3,
    enableImageSelection: true,
  },
  argTypes: galleryArgTypes,
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultGallery: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'A complete responsive gallery with selection enabled. Hover a tile, resize the canvas, or change the layout controls.',
      },
    },
  },
  render: function Render(args) {
    const [images, setImages] = useState(args.images);

    return (
      <Gallery
        {...args}
        images={images}
        onSelect={(index, image, event) => {
          setImages((current) =>
            current.map((item, itemIndex) =>
              itemIndex === index
                ? { ...item, isSelected: !image.isSelected }
                : item,
            ),
          );
          args.onSelect?.(index, image, event);
        }}
      />
    );
  },
};
