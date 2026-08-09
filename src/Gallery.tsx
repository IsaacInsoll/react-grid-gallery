import type { MouseEvent, ReactElement } from 'react';
import { Image } from './Image';
import { useContainerWidth } from './useContainerWidth';
import { buildLayoutFlat } from './buildLayout';
import type {
  GalleryLayout,
  GalleryProps,
  Image as ImageInterface,
} from './types';
import * as styles from './styles';

type ResolvedGalleryProps<T extends ImageInterface = ImageInterface> =
  GalleryProps<T> & {
    layout?: GalleryLayout;
    rowHeight?: number;
    maxRows?: number;
    columnWidth?: number;
  };

export const Gallery = <T extends ImageInterface>(
  props: GalleryProps<T>,
): ReactElement => {
  const resolvedProps: ResolvedGalleryProps<T> = props;
  const {
    images,
    id = 'ReactGridGallery',
    enableImageSelection = true,
    onSelect = () => {},
    rowHeight = 180,
    maxRows,
    margin = 2,
    defaultContainerWidth = 0,
    onClick = () => {},
    tileViewportStyle,
    thumbnailStyle,
    tagStyle,
    thumbnailImageComponent,
  } = resolvedProps;

  const { containerRef, containerWidth } = useContainerWidth(
    defaultContainerWidth,
  );

  const thumbnails = buildLayoutFlat<T>(images, {
    containerWidth,
    maxRows,
    rowHeight,
    margin,
  });

  const handleSelect = (index: number, event: MouseEvent<HTMLElement>) => {
    event.preventDefault();

    const item = images[index];
    if (!item) return;

    onSelect(index, item, event);
  };

  const handleClick = (index: number, event: MouseEvent<HTMLElement>) => {
    const item = images[index];
    if (!item) return;

    onClick(index, item, event);
  };

  return (
    <div id={id} className="ReactGridGallery" ref={containerRef}>
      <div style={styles.gallery}>
        {thumbnails.map((item, index) => (
          <Image
            key={item.key || index}
            item={item}
            index={index}
            margin={margin}
            isSelectable={enableImageSelection}
            onClick={handleClick}
            onSelect={handleSelect}
            tagStyle={tagStyle}
            tileViewportStyle={tileViewportStyle}
            thumbnailStyle={thumbnailStyle}
            thumbnailImageComponent={thumbnailImageComponent}
          />
        ))}
      </div>
    </div>
  );
};

Gallery.displayName = 'Gallery';
