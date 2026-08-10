import { useState } from 'react';
import {
  CheckButton,
  buildLayout,
  buildLayoutFlat,
  buildMasonryLayout,
} from '@picr/react-grid-gallery';
import type { GalleryLayout } from '@picr/react-grid-gallery';
import { dogPhotos } from './gallery-data';

type HeadlessLayoutProps = {
  containerWidth: number;
  layout: GalleryLayout;
};

export const HeadlessLayout = ({
  containerWidth,
  layout,
}: HeadlessLayoutProps) => {
  const [photos, setPhotos] = useState(dogPhotos.slice(0, 8));
  const justifiedOptions = { containerWidth, rowHeight: 170, margin: 4 };
  const masonryOptions = { containerWidth, columnWidth: 190, margin: 4 };
  const groups =
    layout === 'masonry'
      ? buildMasonryLayout(photos, masonryOptions)
      : buildLayout(photos, justifiedOptions);
  const flatItems =
    layout === 'masonry'
      ? groups.flat()
      : buildLayoutFlat(photos, justifiedOptions);

  return (
    <section
      className="headless-example"
      aria-labelledby="headless-title"
      style={{ width: containerWidth }}
    >
      <header>
        <div>
          <span className="product-kicker">Custom {layout} renderer</span>
          <h2 id="headless-title">Gallery maths, your tiles.</h2>
        </div>
        <dl>
          <div>
            <dt>{layout === 'masonry' ? 'Columns' : 'Rows'}</dt>
            <dd data-testid="headless-row-count">{groups.length}</dd>
          </div>
          <div>
            <dt>Flat items</dt>
            <dd data-testid="headless-item-count">{flatItems.length}</dd>
          </div>
        </dl>
      </header>
      <div
        className={`headless-rows${layout === 'masonry' ? ' headless-rows--masonry' : ''}`}
      >
        {groups.map((group, groupIndex) => (
          <div
            className={`headless-row${layout === 'masonry' ? ' headless-row--masonry' : ''}`}
            key={`group-${String(groupIndex)}`}
          >
            {group.map((photo) => (
              <article
                className="headless-tile"
                key={photo.id}
                style={{
                  width: photo.viewportWidth,
                  height: photo.scaledHeight,
                  margin:
                    layout === 'masonry'
                      ? masonryOptions.margin
                      : justifiedOptions.margin,
                }}
              >
                <img src={photo.src} alt={photo.alt} />
                <span>{photo.filename}</span>
                <CheckButton
                  isSelected={photo.isSelected}
                  color="#ffffff99"
                  hoverColor="#ffffffff"
                  selectedColor="#ffca5cff"
                  onClick={() => {
                    setPhotos((current) =>
                      current.map((item) =>
                        item.id === photo.id
                          ? { ...item, isSelected: !item.isSelected }
                          : item,
                      ),
                    );
                  }}
                />
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
