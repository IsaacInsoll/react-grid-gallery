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

The package does not bundle a `ResizeObserver` polyfill. Without a native
implementation, the gallery still measures its container once on mount but does
not react to later container resizes. Install a global polyfill when resize
responsiveness is required in an environment that lacks it; jsdom-based unit
tests generally do not need one.

`rowHeight` is a target rather than a guaranteed height. A row that overflows
the container at that height is proportionally rescaled so every image remains
fully visible. This includes an overflowing final or single-image row. An
underfilled final row keeps the target height and its natural scaled widths.

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
| `href`             | `string`           | Makes the tile viewport a native link      |

`ImageTag` has a required `value: ReactNode`, required `title: string`, and an
optional `key: string | number`.

### Linked Tiles

A non-empty `href` renders that image's viewport as a native anchor. No click
handler is required for ordinary links:

```tsx
const images: Image[] = [
  {
    src: '/albums/landscapes.jpg',
    width: 800,
    height: 600,
    href: '/albums/landscapes',
  },
];

<Gallery images={images} />;
```

Images with no `href`, or with an empty string, keep the inherited `div`
markup. A single gallery can therefore mix linked and unlinked tiles — for
example, linking photos while leaving video tiles to open a lightbox through
`onClick`.

#### Activation

| Activation                      | Calls `Gallery.onClick`  | Default behavior        |
| ------------------------------- | ------------------------ | ----------------------- |
| Plain left click                | Yes                      | Follows the link        |
| Enter on the focused tile       | Yes                      | Follows the link        |
| Ctrl/Cmd/Shift/Alt + left click | Yes, with modifier flags | Native browser behavior |
| Middle click                    | No                       | Opens a new tab         |

Anything that calls `Gallery.onClick` follows the link afterwards unless the
callback calls `event.preventDefault()`.

Middle clicks are the exception, and the reason is worth knowing: the gallery
listens for `click`, and browsers dispatch `auxclick` for non-primary buttons.
Middle-click activations therefore never reach `Gallery.onClick` at all. Code
that counts tile activations for analytics will not observe them.

#### Keyboard And Focus

A linked viewport is a real anchor, so it joins the tab order and can be
activated with Enter. Unlinked viewports remain non-focusable `div` elements,
preserving the inherited behavior exactly. Adding `href` to an existing gallery
therefore adds its tiles to the tab order.

#### Containment

The built-in selection button, tags, overlays, and thumbnail caption are
siblings of the viewport and remain outside the anchor, so they keep working
independently of the link.

A custom thumbnail is different: it renders _inside_ the anchor. It must not
contain another anchor, a button, or any other interactive descendant, because
nested interactive elements are invalid HTML and browsers will restructure
them. When a custom thumbnail needs to display something that is normally a
link or button, render a static element such as a `span` for the linked case
and let the surrounding tile anchor provide the navigation.

#### Client-Side Routers

The gallery is router-neutral and does not prevent native navigation
automatically. To use client-side routing, intercept unmodified clicks and call
your router after preventing the browser navigation:

```tsx
<Gallery
  images={images}
  onClick={(_index, image, event) => {
    if (
      image.href &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      navigate(image.href);
    }
  }}
/>
```

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
`marginLeft` remains available for compatibility but is `0` for rescaled rows;
the gallery now fits them by changing their dimensions instead of applying a
negative horizontal cropping offset.

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
