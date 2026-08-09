import type {
  ComponentType,
  CSSProperties,
  MouseEvent,
  ReactNode,
} from 'react';

type Key = string | number;

export interface ImageTag {
  value: ReactNode;
  title: string;
  key?: Key;
}

export interface Image {
  key?: Key;
  src: string;
  width: number;
  height: number;
  nano?: string;
  alt?: string;
  tags?: ImageTag[];
  isSelected?: boolean;
  caption?: ReactNode;
  customOverlay?: ReactNode;
  thumbnailCaption?: ReactNode;
  orientation?: number;
  href?: string;
}

export type ImageExtended<T extends Image = Image> = T & {
  scaledWidth: number;
  scaledHeight: number;
  viewportWidth: number;
  marginLeft: number;
};

export type ImageExtendedWithIndex<T extends Image = Image> =
  ImageExtended<T> & {
    originalIndex: number;
  };

export interface BuildLayoutOptions {
  containerWidth: number;
  maxRows?: number;
  rowHeight?: number;
  margin?: number;
}

export interface BuildMasonryLayoutOptions {
  containerWidth: number;
  columnWidth?: number;
  margin?: number;
}

export type ImageExtendedRow<T extends Image = Image> = ImageExtended<T>[];

export type MasonryColumn<T extends Image = Image> =
  ImageExtendedWithIndex<T>[];

export type MasonryLayout<T extends Image = Image> = MasonryColumn<T>[];

export type EventHandler<T extends Image = Image> = (
  index: number,
  item: T,
  event: MouseEvent<HTMLElement>,
) => void;

export type StyleFunctionContext<T extends Image = Image> = {
  item: T;
};

export type StyleFunction<T extends Image = Image> = (
  context: StyleFunctionContext<T>,
) => CSSProperties;

export type StyleProp<T extends Image = Image> =
  CSSProperties | StyleFunction<T>;

export interface ImageProps<T extends ImageExtended = ImageExtended> {
  item: T;
  index: number;
  margin: number;
  isSelectable: boolean;
  onClick: (index: number, event: MouseEvent<HTMLElement>) => void;
  onSelect: (index: number, event: MouseEvent<HTMLElement>) => void;
  tileViewportStyle?: StyleProp<T>;
  thumbnailStyle?: StyleProp<T>;
  tagStyle?: StyleProp<T>;
  /**
   * @deprecated Unused by the built-in Image component. This will be removed in v2.
   */
  height?: number;
  thumbnailImageComponent?: ComponentType<ThumbnailImageProps<T>>;
}

export interface ThumbnailImageComponentImageProps {
  src: string;
  alt: string;
  title: string | null;
  style: CSSProperties;
}

export type ThumbnailImageProps<T extends ImageExtended = ImageExtended> =
  ImageProps<T> & {
    imageProps: ThumbnailImageComponentImageProps;
  };

export type GalleryLayout = 'justified' | 'masonry';

type BaseGalleryProps<T extends Image = Image> = {
  images: T[];
  id?: string;
  enableImageSelection?: boolean;
  onSelect?: EventHandler<T>;
  margin?: number;
  defaultContainerWidth?: number;
  onClick?: EventHandler<T>;
  tileViewportStyle?: StyleProp<ImageExtended<T>>;
  thumbnailStyle?: StyleProp<ImageExtended<T>>;
  tagStyle?: StyleProp<ImageExtended<T>>;
  thumbnailImageComponent?: ComponentType<
    ThumbnailImageProps<ImageExtended<T>>
  >;
};

export type GalleryProps<T extends Image = Image> = BaseGalleryProps<T> &
  (
    | {
        layout?: 'justified';
        rowHeight?: number;
        maxRows?: number;
      }
    | {
        layout: 'masonry';
        columnWidth?: number;
      }
  );

export interface CheckButtonProps {
  isSelected?: boolean;
  isVisible?: boolean;
  onClick: (event: MouseEvent<HTMLElement>) => void;
  label?: string;
  color?: string;
  selectedColor?: string;
  hoverColor?: string;
  disabled?: boolean;
}
