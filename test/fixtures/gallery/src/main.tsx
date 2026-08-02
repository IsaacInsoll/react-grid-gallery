import { createElement } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { renderToString } from 'react-dom/server';
import { Gallery } from '@gallery';
import type { GalleryProps, ThumbnailImageProps } from '@gallery';
import { images, justificationImages } from './images';

declare const __REACT_VERSION__: string;

const transparentPixel =
  'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
const redPixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8L+7yHwAF0gJbauK6vQAAAABJRU5ErkJggg==';
const bluePixel =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mO0jfr3HwAFBwKW6YMOIwAAAABJRU5ErkJggg==';

const tags = [
  { value: '     ', title: '     ' },
  { value: '     ', title: '     ' },
];

const linkedImages = images.map((image, index) => ({
  ...image,
  href: `/?scenario=linked-destination&image=${String(index)}`,
}));

const handleLinkedClick: NonNullable<GalleryProps['onClick']> = (
  _index,
  _image,
  event,
) => {
  const isModified =
    event.button !== 0 ||
    event.altKey ||
    event.ctrlKey ||
    event.metaKey ||
    event.shiftKey;
  document.body.dataset.galleryClick = isModified
    ? 'modified'
    : event.detail === 0
      ? 'keyboard'
      : 'plain';

  if (!isModified) {
    event.preventDefault();
  }
};

const scenario =
  new URLSearchParams(window.location.search).get('scenario') ?? 'default';
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Browser fixture root element was not found.');
}

const CustomThumbnail = ({ imageProps }: ThumbnailImageProps) => {
  const { title, ...nativeImageProps } = imageProps;

  return (
    <img
      {...nativeImageProps}
      className="custom-thumbnail"
      title={title ?? undefined}
    />
  );
};

const getGalleryProps = (): GalleryProps => {
  switch (scenario) {
    case 'row-height':
      return { images, rowHeight: 100 };
    case 'margin':
      return { images, margin: 10 };
    case 'max-rows':
      return { images, maxRows: 2 };
    case 'selected':
      return {
        images: images.map((image) => ({ ...image, isSelected: true })),
      };
    case 'transparent':
      return {
        images: images.map((image) => ({
          ...image,
          src: transparentPixel,
        })),
      };
    case 'nano':
      return {
        images: images.map((image, index) => ({
          ...image,
          src: transparentPixel,
          nano: index % 2 ? redPixel : bluePixel,
        })),
      };
    case 'tags':
      return {
        images: images.map((image, index) => ({
          ...image,
          tags: index % 2 ? tags : [],
        })),
      };
    case 'tag-style':
      return {
        images: images.map((image, index) => ({
          ...image,
          tags: index % 2 ? tags : [],
        })),
        tagStyle: {
          background: 'white',
          padding: 10,
          opacity: 1,
        },
      };
    case 'decimal-width':
      rootElement.style.width = '474.7px';
      return { images };
    case 'row-justification':
      rootElement.style.width = '503px';
      return { images: justificationImages, rowHeight: 180, margin: 2 };
    case 'custom-thumbnail':
      return { images, thumbnailImageComponent: CustomThumbnail };
    case 'linked':
      return { images: linkedImages, onClick: handleLinkedClick };
    case 'linked-native':
      return { images: linkedImages };
    case 'linked-custom-thumbnail':
      return {
        images: linkedImages,
        onClick: handleLinkedClick,
        thumbnailImageComponent: CustomThumbnail,
      };
    default:
      return { images };
  }
};

const galleryProps = getGalleryProps();
const gallery = createElement(Gallery, galleryProps);

if (new URLSearchParams(window.location.search).has('hydrate')) {
  const defaultContainerWidth = rootElement.getBoundingClientRect().width;
  const hydratableGallery = createElement(Gallery, {
    ...galleryProps,
    defaultContainerWidth,
  });

  rootElement.innerHTML = renderToString(hydratableGallery);
  hydrateRoot(rootElement, hydratableGallery);
} else {
  createRoot(rootElement).render(gallery);
}

const markReady = async () => {
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() => {
      resolve();
    }),
  );
  await Promise.all(
    Array.from(document.images).map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete) {
            resolve();
            return;
          }

          image.addEventListener(
            'load',
            () => {
              resolve();
            },
            { once: true },
          );
          image.addEventListener(
            'error',
            () => {
              resolve();
            },
            { once: true },
          );
        }),
    ),
  );
  await new Promise<void>((resolve) =>
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        resolve();
      }),
    ),
  );

  document.body.dataset.galleryReady = 'true';
  document.body.dataset.reactVersion = __REACT_VERSION__;
};

void markReady();
