# API Reference

All supported values and types are imported from the package root.

```ts
import {
  CheckButton,
  Gallery,
  buildLayout,
  buildLayoutFlat,
} from '@picr/react-grid-gallery';
import type { GalleryProps, Image } from '@picr/react-grid-gallery';
```

Deep imports from `src` or `dist` are not part of the public API.

## `Gallery`

`Gallery` is generic over an image type extending `Image`, so application fields
remain available in callbacks and style functions.

| Prop                      | Type                                      | Default            |
| ------------------------- | ----------------------------------------- | ------------------ |
| `images`                  | `T[]`                                     | Required           |
| `id`                      | `string`                                  | `ReactGridGallery` |
| `enableImageSelection`    | `boolean`                                 | `true`             |
| `onSelect`                | `EventHandler<T>`                         | No-op              |
| `onClick`                 | `EventHandler<T>`                         | No-op              |
| `rowHeight`               | `number`                                  | `180`              |
| `maxRows`                 | `number`                                  | Unlimited          |
| `margin`                  | `number`                                  | `2`                |
| `defaultContainerWidth`   | `number`                                  | `0`                |
| `tileViewportStyle`       | `StyleProp<ImageExtended<T>>`             | Internal style     |
| `thumbnailStyle`          | `StyleProp<ImageExtended<T>>`             | Internal style     |
| `tagStyle`                | `StyleProp<ImageExtended<T>>`             | Internal style     |
| `thumbnailImageComponent` | `ComponentType<ThumbnailImageProps<...>>` | Native `<img>`     |

The containing element must have a width. `defaultContainerWidth` is useful for
server rendering before `ResizeObserver` can report the browser width.

### Selection

```tsx
interface Photo extends Image {
  id: string;
}

import type { EventHandler } from '@picr/react-grid-gallery';

const handleSelect: EventHandler<Photo> = (index, image) => {
  setImages((current) =>
    current.map((item, itemIndex) =>
      itemIndex === index ? { ...item, isSelected: !image.isSelected } : item,
    ),
  );
};

<Gallery images={images} onSelect={handleSelect} />;
```

### Custom Thumbnail

```tsx
import type { ThumbnailImageProps } from '@picr/react-grid-gallery';

const Thumbnail = ({ imageProps }: ThumbnailImageProps) => {
  const { title, ...nativeImageProps } = imageProps;

  return (
    <img {...nativeImageProps} title={title ?? undefined} loading="lazy" />
  );
};

<Gallery images={images} thumbnailImageComponent={Thumbnail} />;
```

React's special `key` is intentionally not included in `imageProps` and must not
be spread into the native element.

## `Image`

| Property           | Type               | Notes                                      |
| ------------------ | ------------------ | ------------------------------------------ |
| `src`              | `string`           | Required image resource                    |
| `width`            | `number`           | Required intrinsic width                   |
| `height`           | `number`           | Required intrinsic height                  |
| `key`              | `string \| number` | Optional stable gallery key                |
| `nano`             | `string`           | Base64 placeholder shown behind the image  |
| `alt`              | `string`           | Native image alternative text              |
| `tags`             | `ImageTag[]`       | Tags rendered over the thumbnail           |
| `isSelected`       | `boolean`          | Controlled selection state                 |
| `caption`          | `ReactNode`        | Consumer metadata; passed through in items |
| `customOverlay`    | `ReactNode`        | Overlay rendered on hover                  |
| `thumbnailCaption` | `ReactNode`        | Caption rendered below the thumbnail       |
| `orientation`      | `number`           | EXIF orientation value                     |

`ImageTag` has a required `value: ReactNode`, required `title: string`, and an
optional `key: string | number`.

## Style Props

`tileViewportStyle`, `thumbnailStyle`, and `tagStyle` accept either a
`CSSProperties` object or a function. The function receives the extended image,
including custom application fields.

```tsx
<Gallery
  images={images}
  thumbnailStyle={({ item }) => ({ opacity: item.isSelected ? 1 : 0.8 })}
/>
```

Related exported types are `StyleProp<T>`, `StyleFunction<T>`, and
`StyleFunctionContext<T>`.

## Layout Helpers

```ts
const rows = buildLayout(images, {
  containerWidth: 960,
  rowHeight: 180,
  margin: 2,
  maxRows: 3,
});

const flat = buildLayoutFlat(images, { containerWidth: 960 });
```

`buildLayout` returns `ImageExtendedRow<T>[]`; `buildLayoutFlat` returns one
flattened `ImageExtendedRow<T>`. `ImageExtended<T>` adds `scaledWidth`,
`scaledHeight`, `viewportWidth`, and `marginLeft` to the original image.

## `CheckButton`

`CheckButton` is the gallery's exported selection control.

| Prop            | Type                                       | Default     |
| --------------- | ------------------------------------------ | ----------- |
| `onClick`       | `(event: MouseEvent<HTMLElement>) => void` | Required    |
| `isSelected`    | `boolean`                                  | `false`     |
| `isVisible`     | `boolean`                                  | `true`      |
| `color`         | `string`                                   | `#FFFFFFB2` |
| `selectedColor` | `string`                                   | `#4285F4FF` |
| `hoverColor`    | `string`                                   | `#FFFFFFFF` |

## Exported Types

The package exports `BuildLayoutOptions`, `CheckButtonProps`, `EventHandler`,
`GalleryProps`, `Image`, `ImageExtended`, `ImageExtendedRow`, `ImageProps`,
`ImageTag`, `StyleFunction`, `StyleFunctionContext`, `StyleProp`,
`ThumbnailImageComponentImageProps`, and `ThumbnailImageProps`.

`ImageProps` is primarily the shared contract used by custom thumbnail props.
Its `isSelectable` value is always a required boolean when supplied by
`Gallery`; its style properties are optional because the internal defaults are
valid when callers omit them.
