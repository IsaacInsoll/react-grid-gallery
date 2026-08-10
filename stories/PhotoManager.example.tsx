import { useMemo, useRef, useState } from 'react';
import { Gallery } from '@picr/react-grid-gallery';
import type { EventHandler } from '@picr/react-grid-gallery';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { dogPhotos } from './gallery-data';
import type { DogPhoto } from './gallery-data';

type Filter = 'All photos' | DogPhoto['album'] | 'Favourites';
type SelectableDogPhoto = DogPhoto & { isSelected: boolean };

const initialSelection = new Set(['round-glasses', 'park-rest', 'red-ball']);
const originalOrder = new Map(
  dogPhotos.map((photo, index) => [photo.id, index]),
);

export const PhotoManager = () => {
  const [photos, setPhotos] = useState<SelectableDogPhoto[]>(() =>
    dogPhotos.map((photo) => ({
      ...photo,
      isSelected: initialSelection.has(photo.id),
    })),
  );
  const [filter, setFilter] = useState<Filter>('All photos');
  const [query, setQuery] = useState('');
  const [activeId, setActiveId] = useState<string>();
  const [lastArchived, setLastArchived] = useState<SelectableDogPhoto[]>([]);
  const [notice, setNotice] = useState('');
  const lastSelectedIdRef = useRef<string | undefined>(undefined);

  const visiblePhotos = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return photos.filter((photo) => {
      const matchesFilter =
        filter === 'All photos' ||
        (filter === 'Favourites' ? photo.isFavorite : photo.album === filter);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        [
          typeof photo.caption === 'string' ? photo.caption : '',
          photo.alt ?? '',
          photo.album,
          photo.filename,
        ].some((value) => value.toLowerCase().includes(normalizedQuery));

      return matchesFilter && matchesQuery;
    });
  }, [filter, photos, query]);

  const selectedPhotos = photos.filter((photo) => photo.isSelected);
  const selectedCount = selectedPhotos.length;
  const viewerIndex = visiblePhotos.findIndex((photo) => photo.id === activeId);
  const slides = useMemo(
    () =>
      visiblePhotos.map((photo) => ({
        src: photo.fullSrc,
        width: photo.fullWidth,
        height: photo.fullHeight,
        alt: photo.alt,
      })),
    [visiblePhotos],
  );

  const handleSelect: EventHandler<DogPhoto> = (_index, photo, event) => {
    const targetIndex = visiblePhotos.findIndex((item) => item.id === photo.id);
    const anchorIndex = visiblePhotos.findIndex(
      (item) => item.id === lastSelectedIdRef.current,
    );
    const nextSelected = !photo.isSelected;
    const rangeIds = new Set(
      event.shiftKey && anchorIndex >= 0 && targetIndex >= 0
        ? visiblePhotos
            .slice(
              Math.min(anchorIndex, targetIndex),
              Math.max(anchorIndex, targetIndex) + 1,
            )
            .map((item) => item.id)
        : [photo.id],
    );

    setPhotos((current) =>
      current.map((item) =>
        rangeIds.has(item.id) ? { ...item, isSelected: nextSelected } : item,
      ),
    );
    lastSelectedIdRef.current = photo.id;
    setNotice(
      event.shiftKey && rangeIds.size > 1
        ? `${String(rangeIds.size)} photos updated as a range.`
        : '',
    );
  };

  const galleryPhotos = visiblePhotos.map((photo) => ({
    ...photo,
    customOverlay: (
      <div className="photo-manager__overlay">
        <span>{photo.caption}</span>
        <span>
          {photo.isFavorite ? '★ Favourite' : photo.album}
          {photo.status === 'processing' ? ' · Processing' : ''}
        </span>
      </div>
    ),
  }));

  return (
    <section className="photo-manager" aria-labelledby="photo-manager-title">
      <header className="photo-manager__header">
        <div>
          <span className="product-kicker">Asset library</span>
          <h2 id="photo-manager-title">Good dogs, ready to ship.</h2>
          <p>
            {photos.length} photos ·{' '}
            <strong data-testid="manager-selected-count">
              {selectedCount} selected
            </strong>
          </p>
        </div>
        <label className="photo-search">
          <span>Search library</span>
          <input
            type="search"
            value={query}
            placeholder="Dog, album, or filename…"
            onChange={(event) => {
              setQuery(event.currentTarget.value);
            }}
          />
        </label>
      </header>

      <div className="photo-manager__controls">
        <div className="filter-pills" aria-label="Filter photographs">
          {(
            [
              'All photos',
              'Park day',
              'Studio portraits',
              'Birthday',
              'Favourites',
            ] as const
          ).map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={filter === option}
              onClick={() => {
                setFilter(option);
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="bulk-actions">
          <button
            type="button"
            disabled={visiblePhotos.length === 0}
            onClick={() => {
              const visibleIds = new Set(
                visiblePhotos.map((photo) => photo.id),
              );
              setPhotos((current) =>
                current.map((photo) =>
                  visibleIds.has(photo.id)
                    ? { ...photo, isSelected: true }
                    : photo,
                ),
              );
            }}
          >
            Select visible
          </button>
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => {
              setPhotos((current) =>
                current.map((photo) => ({ ...photo, isSelected: false })),
              );
            }}
          >
            Clear
          </button>
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => {
              setNotice(
                `Prepared ${String(selectedCount)} original file${selectedCount === 1 ? '' : 's'} for download.`,
              );
            }}
          >
            Download
          </button>
          <button
            className="danger-action"
            type="button"
            disabled={selectedCount === 0}
            onClick={() => {
              setLastArchived(selectedPhotos);
              setPhotos((current) =>
                current.filter((photo) => !photo.isSelected),
              );
              setActiveId(undefined);
              setNotice(
                `Archived ${String(selectedCount)} photo${selectedCount === 1 ? '' : 's'}.`,
              );
            }}
          >
            Archive
          </button>
        </div>
      </div>

      <div className="photo-manager__notice" aria-live="polite">
        <span>
          {notice || 'Select a checkmark, or shift-click to select a range.'}
        </span>
        {lastArchived.length > 0 ? (
          <button
            type="button"
            onClick={() => {
              setPhotos((current) =>
                [...current, ...lastArchived].sort(
                  (left, right) =>
                    (originalOrder.get(left.id) ?? 0) -
                    (originalOrder.get(right.id) ?? 0),
                ),
              );
              setNotice('Archived photos restored.');
              setLastArchived([]);
            }}
          >
            Undo
          </button>
        ) : null}
      </div>

      {galleryPhotos.length > 0 ? (
        <Gallery
          id="asset-library"
          images={galleryPhotos}
          rowHeight={190}
          margin={3}
          onSelect={handleSelect}
          onClick={(_index, photo) => {
            setActiveId(photo.id);
          }}
        />
      ) : (
        <div className="photo-manager__empty">
          <strong>No photographs match this view.</strong>
          <span>Clear the search or choose another album.</span>
        </div>
      )}

      <Lightbox
        open={viewerIndex >= 0}
        index={Math.max(0, viewerIndex)}
        slides={slides}
        close={() => {
          setActiveId(undefined);
        }}
        on={{
          view: ({ index }) => {
            setActiveId(visiblePhotos[index]?.id);
          },
        }}
      />
    </section>
  );
};
