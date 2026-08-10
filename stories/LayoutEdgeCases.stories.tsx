import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gallery } from '@picr/react-grid-gallery';
import { demoImages } from './gallery-data';
import { galleryArgTypes } from './gallery-arg-types';

const demoImageAt = (index: number) => {
  const image = demoImages[index];
  if (!image) throw new Error(`Missing demo image ${String(index)}`);
  return image;
};

const panoramaImages = [
  { ...demoImageAt(9), width: 2400, height: 420, caption: '5.7:1 panorama' },
  {
    ...demoImageAt(6),
    width: 420,
    height: 1800,
    caption: 'Very tall portrait',
  },
  { ...demoImageAt(2), width: 1600, height: 500, caption: 'Wide crop' },
  { ...demoImageAt(8), width: 900, height: 900, caption: 'Square crop' },
];

const orientationSource = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><rect width="640" height="640" rx="36" fill="#2f2850"/><path d="M320 92 478 270h-92v230H254V270h-92Z" fill="#ffca5c"/><text x="320" y="565" fill="white" text-anchor="middle" font-family="system-ui,sans-serif" font-size="52" font-weight="700">TOP</text></svg>',
)}`;

const orientationImages = [
  { value: 1, label: 'Normal' },
  { value: 3, label: '180°' },
  { value: 6, label: '90° clockwise' },
  { value: 8, label: '270° clockwise' },
].map(({ value, label }) => ({
  key: `orientation-${String(value)}`,
  src: orientationSource,
  width: 640,
  height: 640,
  orientation: value,
  alt: `Up arrow transformed with EXIF orientation ${String(value)}`,
  caption: `EXIF ${String(value)}: ${label}`,
  thumbnailCaption: (
    <span className="orientation-caption">
      <strong>EXIF {value}</strong>
      <span>{label}</span>
    </span>
  ),
}));

const HiddenContainerExample = () => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <section
      className="hidden-container-example"
      aria-labelledby="hidden-panel-title"
    >
      <div className="example-toolbar">
        <div>
          <strong id="hidden-panel-title">
            Gallery mounted in a hidden panel
          </strong>
          <span>
            Reveal it after mount; ResizeObserver supplies the first measurable
            width without a remount key or window resize.
          </span>
        </div>
        <button
          type="button"
          aria-expanded={isVisible}
          aria-controls="hidden-gallery-panel"
          onClick={() => {
            setIsVisible((current) => !current);
          }}
        >
          {isVisible ? 'Hide panel' : 'Reveal panel'}
        </button>
      </div>
      <div id="hidden-gallery-panel" hidden={!isVisible}>
        <Gallery
          id="revealed-gallery"
          images={demoImages.slice(0, 6)}
          enableImageSelection={false}
          rowHeight={170}
        />
      </div>
    </section>
  );
};

const MaxRowsPreviewExample = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <section aria-labelledby="album-preview-title">
      <div className="example-toolbar">
        <div>
          <strong id="album-preview-title">
            {isExpanded ? 'Complete album' : 'Two-row album preview'}
          </strong>
          <span>
            The application owns the reveal control; Gallery limits justified
            rows only while the preview is collapsed.
          </span>
        </div>
        <button
          type="button"
          aria-expanded={isExpanded}
          onClick={() => {
            setIsExpanded((current) => !current);
          }}
        >
          {isExpanded ? 'Show preview' : 'Show all'}
        </button>
      </div>
      <Gallery
        images={demoImages}
        enableImageSelection={false}
        rowHeight={150}
        margin={3}
        {...(isExpanded ? {} : { maxRows: 2 })}
      />
    </section>
  );
};

const meta = {
  title: 'Gallery/Layout edge cases',
  component: Gallery,
  argTypes: galleryArgTypes,
  parameters: {
    docs: {
      description: {
        component:
          'Focused cases for justified rows and masonry columns. The directional abstract artwork makes geometry changes easy to inspect.',
      },
    },
  },
} satisfies Meta<typeof Gallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const OverflowingSingleRow: Story = {
  args: {
    images: demoImages.slice(0, 3),
    enableImageSelection: false,
    rowHeight: 240,
    margin: 4,
  },
  parameters: {
    docs: {
      description: {
        story:
          'When one final row would overflow, the maintained algorithm scales the row proportionally instead of cropping image edges.',
      },
    },
  },
  render: (args) => (
    <div className="edge-case-gallery edge-case-gallery--overflow">
      <Gallery {...args} />
    </div>
  ),
};

export const ExtremeAspectRatios: Story = {
  args: {
    images: panoramaImages,
    enableImageSelection: false,
    rowHeight: 180,
    margin: 4,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Panoramas, tall portraits, wide crops, and squares can share the same justified layout without special-case markup.',
      },
    },
  },
  render: (args) => <Gallery {...args} />,
};

export const MasonryAspectRatios: Story = {
  args: {
    images: panoramaImages,
    layout: 'masonry',
    columnWidth: 180,
    enableImageSelection: false,
    margin: 4,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Masonry keeps each image's independent height while assigning panoramas, portraits, and squares to responsive columns.",
      },
    },
  },
  render: (args) => <Gallery {...args} />,
};

export const MaxRowsPreview: Story = {
  args: {
    images: demoImages,
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          '`maxRows` is useful for a justified album preview. The application can remove the limit when someone asks to see the complete collection.',
      },
    },
  },
  render: () => <MaxRowsPreviewExample />,
};

export const ExifOrientation: Story = {
  args: {
    images: orientationImages,
    enableImageSelection: false,
    rowHeight: 180,
    margin: 5,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Standard EXIF values rotate the rendered thumbnail. The square directional source isolates that transform from aspect-ratio calculations; continue to supply the image dimensions expected by your processed thumbnail.',
      },
    },
  },
  render: (args) => <Gallery {...args} />,
};

export const HiddenThenRevealed: Story = {
  args: {
    images: demoImages.slice(0, 6),
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Tabs, accordions, and modals often mount children at zero width. Gallery renders once its container becomes measurable; keep ResizeObserver available and give the revealed panel a real width.',
      },
    },
  },
  render: () => <HiddenContainerExample />,
};

export const NarrowContainer: Story = {
  args: {
    images: demoImages.slice(0, 7),
    enableImageSelection: false,
    rowHeight: 150,
    margin: 3,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Gallery responds to its immediate container, so it works naturally inside a sidebar or split pane regardless of viewport width.',
      },
    },
  },
  render: (args) => (
    <aside className="narrow-gallery" aria-label="Photographs in a sidebar">
      <Gallery {...args} id="sidebar-gallery" />
    </aside>
  ),
};

export const MultipleGalleries: Story = {
  args: {
    images: demoImages.slice(0, 7),
  },
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Give each root a unique `id` when several galleries share a page, or when analytics and browser tests need stable targets.',
      },
    },
  },
  render: (args) => (
    <div className="split-galleries">
      <section aria-labelledby="first-gallery-heading">
        <h2 id="first-gallery-heading">Recent photographs</h2>
        <Gallery
          id="recent-gallery"
          images={args.images.slice(0, 3)}
          enableImageSelection={false}
          rowHeight={150}
        />
      </section>
      <section aria-labelledby="second-gallery-heading">
        <h2 id="second-gallery-heading">Archive favourites</h2>
        <Gallery
          id="archive-gallery"
          images={args.images.slice(3, 7)}
          enableImageSelection={false}
          rowHeight={150}
        />
      </section>
    </div>
  ),
};
