import {
  CheckButton,
  Gallery,
  buildLayout,
  buildLayoutFlat,
  buildMasonryLayout,
} from '@picr/react-grid-gallery';
import type {
  BuildLayoutOptions,
  BuildMasonryLayoutOptions,
  CheckButtonProps,
  EventHandler,
  GalleryLayout,
  GalleryProps,
  Image,
  ImageExtended,
  ImageExtendedRow,
  ImageExtendedWithIndex,
  ImageProps,
  ImageTag,
  MasonryColumn,
  MasonryLayout,
  StyleFunction,
  StyleFunctionContext,
  StyleProp,
  ThumbnailImageComponentImageProps,
  ThumbnailImageProps,
} from '@picr/react-grid-gallery';
import type { ReactElement } from 'react';

interface CustomImage extends Image {
  id: string;
  rating: number;
}

const tags: ImageTag[] = [{ value: 'featured', title: 'Featured' }];

const image: CustomImage = {
  id: 'image-1',
  rating: 5,
  href: '/albums/image-1',
  src: '/image.jpg',
  width: 800,
  height: 600,
  tags,
};
const images: CustomImage[] = [image];
const imageHref: string | undefined = image.href;

const onSelect: EventHandler<CustomImage> = (_index, item, event) => {
  const id: string = item.id;
  const rating: number = item.rating;
  const element: HTMLElement = event.currentTarget;
  void [id, rating, element];
};

const styleContext: StyleFunctionContext<CustomImage> = { item: image };
const customStyle: StyleFunction<CustomImage> = ({ item }) => ({
  opacity: item.rating / 5,
});
const styleProp: StyleProp<CustomImage> = customStyle;

const extendedImage: ImageExtended<CustomImage> = {
  ...image,
  scaledWidth: 240,
  scaledHeight: 180,
  viewportWidth: 236,
  marginLeft: -2,
};

const CustomThumbnail = (
  props: ThumbnailImageProps<ImageExtended<CustomImage>>,
): ReactElement => {
  const isSelectable: boolean = props.isSelectable;
  const id: string = props.item.id;
  const imageProps: ThumbnailImageComponentImageProps = props.imageProps;
  const { title, ...nativeImageProps } = imageProps;

  // @ts-expect-error React's special key is intentionally not a spreadable image prop.
  const forbiddenKey = imageProps.key;

  void [isSelectable, id, forbiddenKey];
  return <img {...nativeImageProps} title={title ?? undefined} />;
};

const imagePropsWithoutStyles: ImageProps<ImageExtended<CustomImage>> = {
  item: extendedImage,
  index: 0,
  margin: 2,
  isSelectable: true,
  onClick: () => {},
  onSelect: () => {},
};

const galleryProps: GalleryProps<CustomImage> = {
  images,
  onClick: onSelect,
  onSelect,
  tileViewportStyle: customStyle,
  thumbnailStyle: styleProp,
  tagStyle: ({ item }) => ({
    width: item.scaledWidth,
    height: item.scaledHeight,
    maxWidth: item.viewportWidth,
    marginLeft: item.marginLeft,
    zIndex: item.rating,
  }),
  thumbnailImageComponent: CustomThumbnail,
};

const galleryElement: ReactElement = <Gallery<CustomImage> {...galleryProps} />;

const layoutName: GalleryLayout = 'masonry';

const justifiedGalleryProps: GalleryProps<CustomImage> = {
  images,
  layout: 'justified',
  rowHeight: 180,
  maxRows: 2,
};

const masonryGalleryProps: GalleryProps<CustomImage> = {
  images,
  layout: 'masonry',
  columnWidth: 220,
};

const invalidMasonryGalleryProps: GalleryProps<CustomImage> = {
  images,
  layout: 'masonry',
  // @ts-expect-error rowHeight is only valid for justified layout.
  rowHeight: 180,
};

const invalidMasonryRowsProps: GalleryProps<CustomImage> = {
  images,
  layout: 'masonry',
  // @ts-expect-error maxRows is only valid for justified layout.
  maxRows: 2,
};

const invalidJustifiedGalleryProps: GalleryProps<CustomImage> = {
  images,
  layout: 'justified',
  // @ts-expect-error columnWidth is only valid for masonry layout.
  columnWidth: 180,
};

const invalidLayoutGalleryProps: GalleryProps<CustomImage> = {
  images,
  // @ts-expect-error layout must be one of the public layout values.
  layout: 'mansory',
};

const checkButtonProps: CheckButtonProps = {
  onClick: () => {},
};
const checkButtonElement: ReactElement = <CheckButton {...checkButtonProps} />;

const layoutOptions: BuildLayoutOptions = {
  containerWidth: 800,
  rowHeight: 180,
  margin: 2,
};
const rows: ImageExtendedRow<CustomImage>[] = buildLayout(
  images,
  layoutOptions,
);
const flat: ImageExtendedRow<CustomImage> = buildLayoutFlat(
  images,
  layoutOptions,
);

const masonryOptions: BuildMasonryLayoutOptions = {
  containerWidth: 800,
  columnWidth: 220,
  margin: 2,
};

const indexedImage: ImageExtendedWithIndex<CustomImage> = {
  ...extendedImage,
  originalIndex: 0,
};
const masonryColumn: MasonryColumn<CustomImage> = [indexedImage];
const masonryLayout: MasonryLayout<CustomImage> = [masonryColumn];
const masonryRows: MasonryLayout<CustomImage> = buildMasonryLayout(
  images,
  masonryOptions,
);

const [firstLayoutImage] = flat;
if (!firstLayoutImage) {
  throw new Error('Expected the layout fixture to contain an image.');
}
const customId: string = firstLayoutImage.id;
const [firstMasonryColumn] = masonryRows;
if (!firstMasonryColumn) {
  throw new Error('Expected the masonry fixture to contain a column.');
}
const [firstMasonryImage] = firstMasonryColumn;
if (!firstMasonryImage) {
  throw new Error('Expected the masonry fixture to contain an image.');
}
const masonryCustomId: string = firstMasonryImage.id;

export {
  checkButtonElement,
  customId,
  galleryElement,
  imageHref,
  imagePropsWithoutStyles,
  invalidJustifiedGalleryProps,
  invalidLayoutGalleryProps,
  invalidMasonryGalleryProps,
  invalidMasonryRowsProps,
  justifiedGalleryProps,
  layoutName,
  masonryCustomId,
  masonryGalleryProps,
  masonryLayout,
  masonryOptions,
  masonryRows,
  rows,
  styleContext,
};
