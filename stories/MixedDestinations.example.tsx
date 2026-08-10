import { useState } from 'react';
import { Gallery } from '@picr/react-grid-gallery';
import { dogPhotos } from './gallery-data';
import type { DogPhoto } from './gallery-data';

const dogPhotoAt = (index: number) => {
  const image = dogPhotos[index];
  if (!image) throw new Error(`Missing dog photo ${String(index)}`);
  return image;
};

const mixedItems: DogPhoto[] = [
  {
    ...dogPhotoAt(0),
    href: '#studio-album',
    tags: [{ value: 'Album link', title: 'Open the studio album' }],
  },
  {
    ...dogPhotoAt(3),
    href: '#park-album',
    tags: [{ value: 'Album link', title: 'Open the park album' }],
  },
  {
    ...dogPhotoAt(4),
    tags: [{ value: 'Viewer action', title: 'Open inside the application' }],
  },
  {
    ...dogPhotoAt(9),
    href: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    tags: [{ value: 'Video ↗', title: 'Open the birthday video on YouTube' }],
    customOverlay: (
      <div className="video-overlay" aria-hidden="true">
        <span>▶</span>
        <strong>Birthday highlight</strong>
      </div>
    ),
  },
  { ...dogPhotoAt(7) },
  { ...dogPhotoAt(8) },
];

export const MixedDestinations = () => {
  const [activity, setActivity] = useState(
    'Choose a tile: links navigate, unlinked photos report an app action.',
  );

  return (
    <section
      className="mixed-destinations"
      aria-labelledby="destinations-title"
    >
      <header>
        <span className="product-kicker">Mixed media collection</span>
        <h2 id="destinations-title">One grid, different destinations</h2>
        <p>
          Album tiles are native in-page links, ordinary photographs stay in the
          application, and the video poster is an explicit external link.
        </p>
      </header>
      <Gallery
        id="mixed-destinations"
        images={mixedItems}
        enableImageSelection={false}
        rowHeight={195}
        onClick={(_index, item) => {
          if (!item.href) {
            setActivity(`Application viewer requested: ${item.filename}`);
          } else if (item.href.startsWith('#')) {
            setActivity(`Following ${item.href}`);
          }
        }}
      />
      <p className="destination-activity" aria-live="polite">
        {activity}
      </p>
      <div className="destination-targets" aria-label="Example link targets">
        <span id="studio-album">Studio album route</span>
        <span id="park-album">Park album route</span>
      </div>
    </section>
  );
};
