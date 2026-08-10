import { useRef, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Gallery } from '@picr/react-grid-gallery';
import type { EventHandler } from '@picr/react-grid-gallery';
import { dogPhotos } from './gallery-data';
import type { DogPhoto } from './gallery-data';
import { galleryArgTypes } from './gallery-arg-types';

const initiallySelected = new Set(['round-glasses', 'park-rest']);

const DogGallery = Gallery<DogPhoto>;

const SelectionExample = ({ initialImages }: { initialImages: DogPhoto[] }) => {
  const [images, setImages] = useState(() =>
    initialImages.map((image) => ({
      ...image,
      isSelected: initiallySelected.has(image.id),
    })),
  );
  const lastSelectedIdRef = useRef<string | undefined>(undefined);

  const handleSelect: EventHandler<DogPhoto> = (_index, image, event) => {
    const targetIndex = images.findIndex((item) => item.id === image.id);
    const anchorIndex = images.findIndex(
      (item) => item.id === lastSelectedIdRef.current,
    );
    const nextSelected = !image.isSelected;

    if (event.shiftKey && anchorIndex >= 0 && targetIndex >= 0) {
      const start = Math.min(anchorIndex, targetIndex);
      const end = Math.max(anchorIndex, targetIndex);
      setImages((current) =>
        current.map((item, index) =>
          index >= start && index <= end
            ? { ...item, isSelected: nextSelected }
            : item,
        ),
      );
    } else {
      setImages((current) =>
        current.map((item) =>
          item.id === image.id ? { ...item, isSelected: nextSelected } : item,
        ),
      );
    }

    lastSelectedIdRef.current = image.id;
  };

  const selectedCount = images.filter((image) => image.isSelected).length;

  return (
    <section className="selection-example" aria-labelledby="selection-title">
      <div className="example-toolbar">
        <div>
          <strong id="selection-title" data-testid="selected-count">
            {selectedCount} selected
          </strong>
          <span>Shift-click another selection control to select a range.</span>
        </div>
        <div className="example-toolbar__actions">
          <button
            type="button"
            onClick={() => {
              setImages((current) =>
                current.map((image) => ({ ...image, isSelected: true })),
              );
            }}
          >
            Select all
          </button>
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => {
              setImages((current) =>
                current.map((image) => ({ ...image, isSelected: false })),
              );
            }}
          >
            Clear
          </button>
        </div>
      </div>
      <Gallery images={images} onSelect={handleSelect} rowHeight={185} />
    </section>
  );
};

const lockedImages = dogPhotos.slice(0, 7).map((image, index) => ({
  ...image,
  isSelected: index === 1 || index === 4,
}));

const meta = {
  title: 'Gallery/Selection',
  component: DogGallery,
  args: { images: dogPhotos },
  argTypes: galleryArgTypes,
  parameters: {
    docs: {
      description: {
        component:
          'Selection is controlled application state. Gallery reports the selected image and original mouse event; the consumer returns updated records.',
      },
    },
  },
} satisfies Meta<typeof DogGallery>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ControlledSelection: Story = {
  parameters: {
    controls: { disable: true },
    docs: {
      description: {
        story:
          'Individual, bulk, and shift-range selection all update the same `isSelected` field. Try selecting one tile and then shift-clicking another.',
      },
    },
  },
  render: (args) => <SelectionExample initialImages={args.images} />,
};

export const LockedSelection: Story = {
  args: {
    images: lockedImages,
    enableImageSelection: false,
    rowHeight: 185,
  },
  parameters: {
    docs: {
      description: {
        story:
          '`enableImageSelection={false}` hides controls and suppresses edits without erasing selected styling—useful for review and confirmation screens.',
      },
    },
  },
  render: (args) => <DogGallery {...args} />,
};
