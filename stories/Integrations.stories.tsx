import { useMemo, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gallery } from '@picr/react-grid-gallery';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { dogPhotos } from './gallery-data';
import { galleryArgTypes } from './gallery-arg-types';

const DogGallery = Gallery<(typeof dogPhotos)[number]>;

const LightboxExample = ({ images }: { images: typeof dogPhotos }) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const slides = useMemo(
    () =>
      images.map((image) => ({
        src: image.fullSrc,
        width: image.fullWidth,
        height: image.fullHeight,
        alt: image.alt,
      })),
    [images],
  );

  return (
    <>
      <Gallery
        images={images}
        enableImageSelection={false}
        onClick={(index) => {
          setActiveIndex(index);
        }}
      />
      <Lightbox
        open={activeIndex >= 0}
        index={activeIndex}
        close={() => {
          setActiveIndex(-1);
        }}
        slides={slides}
        on={{
          view: ({ index }) => {
            setActiveIndex(index);
          },
        }}
      />
    </>
  );
};

const meta = {
  title: 'Advanced/Viewer integration',
  component: DogGallery,
  args: { images: dogPhotos },
  argTypes: galleryArgTypes,
  parameters: {
    docs: {
      description: {
        component:
          'Gallery stays viewer-neutral. This working YARL integration sends the selected index to a modal viewer while keeping its slide state stable.',
      },
    },
  },
} satisfies Meta<typeof DogGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FullResolutionLightbox: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'The grid loads optimized local WebP thumbnails; opening a tile gives YARL the corresponding original 4K–7K JPEG through the typed `fullSrc` application field.',
      },
    },
  },
  render: (args) => <LightboxExample images={args.images} />,
};
