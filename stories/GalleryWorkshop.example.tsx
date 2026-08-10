import { useMemo, useState } from 'react';
import { Gallery } from '@picr/react-grid-gallery';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { dogPhotos } from './gallery-data';

export const GalleryWorkshop = () => {
  const [layout, setLayout] = useState<'justified' | 'masonry'>('justified');
  const [size, setSize] = useState(180);
  const [isSelectable, setIsSelectable] = useState(false);
  const [imageCount, setImageCount] = useState(dogPhotos.length);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => new Set());
  const [activeIndex, setActiveIndex] = useState(-1);

  const workshopPhotos = useMemo(
    () =>
      Array.from({ length: imageCount }, (_, index) => {
        const source = dogPhotos[index % dogPhotos.length];
        if (!source)
          throw new Error('The gallery workshop needs at least one photo');

        const id = `${source.id}-${String(index)}`;
        return {
          ...source,
          id,
          key: id,
          isSelected: selectedIds.has(id),
        };
      }),
    [imageCount, selectedIds],
  );
  const slides = useMemo(
    () =>
      workshopPhotos.map((photo) => ({
        src: photo.fullSrc,
        width: photo.fullWidth,
        height: photo.fullHeight,
        alt: photo.alt,
      })),
    [workshopPhotos],
  );
  const layoutProps =
    layout === 'masonry'
      ? ({ layout: 'masonry', columnWidth: size } as const)
      : ({ layout: 'justified', rowHeight: size } as const);
  const selectedCount = workshopPhotos.filter(
    (photo) => photo.isSelected,
  ).length;

  return (
    <section
      className="gallery-workshop"
      aria-labelledby="gallery-workshop-title"
    >
      <header>
        <div>
          <span className="product-kicker">Interactive album</span>
          <h2 id="gallery-workshop-title">Park day</h2>
          <p>
            {imageCount} {imageCount === 1 ? 'photograph' : 'photographs'} ·
            open any thumbnail in the full-resolution viewer
          </p>
        </div>

        <div className="gallery-workshop__controls">
          <fieldset>
            <legend>Layout</legend>
            <div className="gallery-workshop__segments">
              {(
                [
                  ['justified', 'Justified'],
                  ['masonry', 'Masonry'],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={layout === value}
                  onClick={() => {
                    setLayout(value);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Thumbnail size</legend>
            <div className="gallery-workshop__size">
              <input
                id="gallery-workshop-size"
                aria-label="Thumbnail size"
                type="range"
                min="100"
                max="300"
                step="10"
                value={size}
                onChange={(event) => {
                  setSize(Number(event.currentTarget.value));
                }}
              />
              <output htmlFor="gallery-workshop-size">{size}px</output>
            </div>
          </fieldset>

          <label className="gallery-workshop__toggle">
            <input
              type="checkbox"
              checked={isSelectable}
              onChange={(event) => {
                setIsSelectable(event.currentTarget.checked);
              }}
            />
            <span aria-hidden="true" />
            Selectable
          </label>
        </div>
      </header>

      <div className="gallery-workshop__range">
        <label htmlFor="gallery-workshop-count">Number of images</label>
        <input
          id="gallery-workshop-count"
          type="range"
          min="1"
          max="50"
          step="1"
          value={imageCount}
          onChange={(event) => {
            setImageCount(Number(event.currentTarget.value));
          }}
        />
        <output htmlFor="gallery-workshop-count">{imageCount}</output>
        {isSelectable && (
          <span className="gallery-workshop__selection" aria-live="polite">
            {selectedCount} selected
            <button
              type="button"
              disabled={selectedCount === 0}
              onClick={() => {
                setSelectedIds(new Set());
              }}
            >
              Clear
            </button>
          </span>
        )}
      </div>

      <div data-testid="gallery-workshop" data-layout={layout}>
        <Gallery
          id="featured-album"
          images={workshopPhotos}
          margin={3}
          enableImageSelection={isSelectable}
          {...layoutProps}
          onClick={(index) => {
            setActiveIndex(index);
          }}
          onSelect={(_index, image) => {
            setSelectedIds((current) => {
              const next = new Set(current);
              if (image.isSelected) next.delete(image.id);
              else next.add(image.id);
              return next;
            });
          }}
        />
      </div>

      <Lightbox
        open={activeIndex >= 0 && activeIndex < slides.length}
        index={activeIndex}
        slides={slides}
        close={() => {
          setActiveIndex(-1);
        }}
        on={{
          view: ({ index }) => {
            setActiveIndex(index);
          },
        }}
      />
    </section>
  );
};
