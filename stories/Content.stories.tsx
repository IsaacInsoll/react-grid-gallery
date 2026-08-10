import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gallery } from '@picr/react-grid-gallery';
import type { ImageExtended, StyleProp } from '@picr/react-grid-gallery';
import { dogPhotos, transparentImage } from './gallery-data';
import type { DogPhoto } from './gallery-data';
import { galleryArgTypes } from './gallery-arg-types';

const tagImages = dogPhotos.slice(0, 7).map((image, index) => ({
  ...image,
  tags: [
    {
      key: 'album',
      value:
        index === 0 ? (
          <a
            href="https://github.com/IsaacInsoll/PICR"
            target="_blank"
            rel="noreferrer"
          >
            PICR album ↗
          </a>
        ) : (
          image.album
        ),
      title: `Album: ${image.album}`,
    },
    ...(image.isFavorite
      ? [{ key: 'favorite', value: '★ Favourite', title: 'Favourite photo' }]
      : []),
    ...(image.status === 'processing'
      ? [{ key: 'status', value: 'Processing', title: 'Image is processing' }]
      : []),
  ],
}));

const captionImages = dogPhotos.slice(0, 6).map((image) => ({
  ...image,
  thumbnailCaption: (
    <span className="thumbnail-caption">
      <strong>{image.caption}</strong>
      <span>{image.filename}</span>
    </span>
  ),
}));

const DogGallery = Gallery<DogPhoto>;

const tagStyle: StyleProp<ImageExtended<DogPhoto>> = ({ item }) => ({
  display: 'inline',
  padding: '.2em .6em .3em',
  fontSize: '75%',
  background: item.status === 'processing' ? '#ffe39a' : '#ffffffdc',
  color: '#211c35',
  borderRadius: 999,
  fontWeight: 750,
  lineHeight: 1,
  textAlign: 'center',
  verticalAlign: 'baseline',
  whiteSpace: 'nowrap',
});

const PlaceholderExample = ({ images }: { images: DogPhoto[] }) => {
  const [loaded, setLoaded] = useState(true);

  useEffect(() => {
    if (loaded) return;

    const timeout = window.setTimeout(() => {
      setLoaded(true);
    }, 900);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [loaded]);

  return (
    <section aria-labelledby="placeholder-status">
      <div className="example-toolbar">
        <div>
          <strong id="placeholder-status" aria-live="polite">
            {loaded ? 'Full images loaded' : 'Painting tiny placeholders…'}
          </strong>
          <span>The row geometry remains stable during the transition.</span>
        </div>
        <button
          type="button"
          disabled={!loaded}
          onClick={() => {
            setLoaded(false);
          }}
        >
          Reload images
        </button>
      </div>
      <Gallery
        enableImageSelection={false}
        images={images.slice(0, 6).map((image) => ({
          ...image,
          src: loaded ? image.src : transparentImage,
        }))}
        rowHeight={190}
      />
    </section>
  );
};

const LoadMoreExample = ({ images }: { images: DogPhoto[] }) => {
  const [visibleCount, setVisibleCount] = useState(4);
  const allVisible = visibleCount >= images.length;

  return (
    <section aria-labelledby="load-more-status">
      <div className="example-toolbar">
        <div>
          <strong id="load-more-status" aria-live="polite">
            Showing {Math.min(visibleCount, images.length)} of {images.length}
          </strong>
          <span>
            Fetching and pagination belong to the app; Gallery reflows the array
            it receives.
          </span>
        </div>
        <button
          type="button"
          onClick={() => {
            setVisibleCount((current) =>
              allVisible ? 4 : Math.min(current + 3, images.length),
            );
          }}
        >
          {allVisible ? 'Start again' : 'Load 3 more'}
        </button>
      </div>
      <Gallery
        id="incremental-gallery"
        images={images.slice(0, visibleCount)}
        enableImageSelection={false}
        rowHeight={180}
      />
    </section>
  );
};

const meta = {
  title: 'Gallery/Content',
  component: DogGallery,
  args: { images: dogPhotos },
  argTypes: galleryArgTypes,
  parameters: {
    docs: {
      description: {
        component:
          'Use metadata layers deliberately: tags are compact overlays, captions reserve visible space, and `nano` supplies a stable loading surface.',
      },
    },
  },
} satisfies Meta<typeof DogGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MultipleTags: Story = {
  args: {
    images: tagImages,
    enableImageSelection: false,
    rowHeight: 190,
    tagStyle,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Each image may have several tags, and `value` may be a string or React node—the first album chip is a real link. Stable keys, concise labels, and wrapping-safe styling keep metadata readable.',
      },
    },
  },
  render: (args) => <DogGallery {...args} />,
};

export const VisibleCaptions: Story = {
  args: {
    images: captionImages,
    enableImageSelection: false,
    rowHeight: 190,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`thumbnailCaption` renders visible content below each tile. The string `caption` also becomes the native image `title`; hover a thumbnail to inspect it.',
      },
    },
  },
  render: (args) => <DogGallery {...args} />,
};

export const CustomOverlays: Story = {
  args: {
    images: dogPhotos.slice(0, 8).map((image) => ({
      ...image,
      customOverlay: (
        <div className="overlay-card">
          <span>
            <strong>{image.caption}</strong>
            <span>
              {image.album} · {image.filename}
            </span>
          </span>
        </div>
      ),
    })),
    enableImageSelection: false,
    rowHeight: 190,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`customOverlay` reveals secondary detail on hover. Essential information should remain available outside hover-only content.',
      },
    },
  },
  render: (args) => <DogGallery {...args} />,
};

export const ProgressivePlaceholders: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Press Reload images to watch tiny local `nano` previews hold the layout until the full thumbnails return.',
      },
    },
  },
  render: (args) => <PlaceholderExample images={args.images} />,
};

export const IncrementalLoading: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Append records for “load more” or infinite-loading flows. Gallery does not fetch, paginate, or virtualize data; it recalculates from the current array while custom thumbnails can use native lazy loading.',
      },
    },
  },
  render: (args) => <LoadMoreExample images={args.images} />,
};
