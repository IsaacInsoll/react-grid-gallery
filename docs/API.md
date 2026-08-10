# API Reference

All supported values and types are imported from the package root.

```ts
import {
  CheckButton,
  Gallery,
  buildLayout,
  buildLayoutFlat,
  buildMasonryLayout,
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
| `layout`                  | `'justified' \| 'masonry'`                | `justified`        |
| `rowHeight`               | `number`                                  | `180`              |
| `maxRows`                 | `number`                                  | Unlimited          |
| `columnWidth`             | `number`                                  | `180`              |
| `margin`                  | `number`                                  | `2`                |
| `defaultContainerWidth`   | `number`                                  | `0`                |
| `tileViewportStyle`       | `StyleProp<ImageExtended<T>>`             | Internal style     |
| `thumbnailStyle`          | `StyleProp<ImageExtended<T>>`             | Internal style     |
| `tagStyle`                | `StyleProp<ImageExtended<T>>`             | Internal style     |
| `thumbnailImageComponent` | `ComponentType<ThumbnailImageProps<...>>` | Native `<img>`     |

The containing element must have a width. `defaultContainerWidth` is useful for
server rendering before `ResizeObserver` can report the browser width. Control
rendered thumbnail sizing with layout props such as `rowHeight`, `columnWidth`,
and `margin`, or with a custom thumbnail component. Changing `Image.width` and
`Image.height` changes the aspect ratio supplied to the layout calculation; it
is not the supported way to request larger or smaller thumbnails.

The package does not bundle a `ResizeObserver` polyfill. Without a native
implementation, the gallery still measures its container once on mount but does
not react to later container resizes. Install a global polyfill when resize
responsiveness is required in an environment that lacks it; jsdom-based unit
tests generally do not need one.

`rowHeight` is a target rather than a guaranteed height. A row that overflows
the container at that height is proportionally rescaled so every image remains
fully visible. This includes an overflowing final or single-image row. An
underfilled final row keeps the target height and its natural scaled widths.

### Choosing A Layout

`layout="justified"` is the default and renders the inherited row-based
gallery. `rowHeight` and `maxRows` apply only to justified layout.

`layout="masonry"` renders column-based masonry layout. `columnWidth` is a
target width rather than a guaranteed width; the gallery calculates an actual
column width from the container so columns fit without horizontal overflow.
Masonry layout does not have a `maxRows` equivalent. Slice `images` before
passing them to `Gallery` when a masonry gallery should show fewer items.
Masonry column balance is calculated from image geometry only. In-flow content
below the viewport, such as `thumbnailCaption`, can make rendered columns less
even because its height cannot be known by the layout helper.

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
| `src`              | `string`           | Required image URL                         |
| `width`            | `number`           | Required intrinsic pixel width             |
| `height`           | `number`           | Required intrinsic pixel height            |
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

When `caption` is a string, it also becomes the thumbnail image's native
`title` attribute.

`src` is passed through to the native `<img>` element. Local images therefore
use normal React/browser asset handling: place files in your app's public/static
directory and pass a URL such as `/photos/image.jpg`, or import an image with
your bundler and pass the imported URL.

`width` and `height` describe the source image's intrinsic dimensions so the
gallery can preserve aspect ratio while calculating rows or masonry columns.
They are not display-size props.

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
so adding `href` to an existing gallery adds its viewports to the tab order.

When image selection is enabled, each tile also has a selection button before
the viewport in the tab order. The button is visually revealed on hover or
focus, exposes its selected state with `aria-pressed`, and can be activated with
Enter or Space. Disabling image selection disables these buttons and removes
them from the tab order.

Masonry layout renders columns in DOM order, so keyboard focus moves through
all tiles in the first column before moving to the next column. Within a linked
selectable tile, focus reaches the selection button before the linked viewport.

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

`scaledWidth`, `scaledHeight`, `viewportWidth`, `marginLeft`, and
`originalIndex` are reserved layout fields. Consumer image types should not
define their own fields with those names.

## Layout Helpers

```ts
const rows = buildLayout(images, {
  containerWidth: 960,
  rowHeight: 180,
  margin: 2,
  maxRows: 3,
});

const flat = buildLayoutFlat(images, { containerWidth: 960 });

const columns = buildMasonryLayout(images, {
  containerWidth: 960,
  columnWidth: 180,
  margin: 2,
});
```

`buildLayout` returns `ImageExtendedRow<T>[]`; `buildLayoutFlat` returns one
flattened `ImageExtendedRow<T>`. `ImageExtended<T>` adds `scaledWidth`,
`scaledHeight`, `viewportWidth`, and `marginLeft` to the original image.
`marginLeft` remains available for compatibility but is `0` for rescaled rows;
the gallery now fits them by changing their dimensions instead of applying a
negative horizontal cropping offset.

`buildMasonryLayout` returns `MasonryLayout<T>`, an array of columns. Each item
is an `ImageExtendedWithIndex<T>` with `originalIndex`, so consumers can map
layout items back to the original `images` array.

## `CheckButton`

`CheckButton` is the gallery's exported selection control.

| Prop            | Type                                       | Default        |
| --------------- | ------------------------------------------ | -------------- |
| `onClick`       | `(event: MouseEvent<HTMLElement>) => void` | Required       |
| `isSelected`    | `boolean`                                  | `false`        |
| `isVisible`     | `boolean`                                  | `true`         |
| `label`         | `string`                                   | `Select image` |
| `color`         | `string`                                   | `#FFFFFFB2`    |
| `selectedColor` | `string`                                   | `#4285F4FF`    |
| `hoverColor`    | `string`                                   | `#FFFFFFFF`    |
| `disabled`      | `boolean`                                  | `false`        |

## Exported Types

The package exports `BuildLayoutOptions`, `BuildMasonryLayoutOptions`,
`CheckButtonProps`, `EventHandler`, `GalleryLayout`, `GalleryProps`, `Image`,
`ImageExtended`, `ImageExtendedRow`, `ImageExtendedWithIndex`, `ImageProps`,
`ImageTag`, `MasonryColumn`, `MasonryLayout`, `StyleFunction`,
`StyleFunctionContext`, `StyleProp`, `ThumbnailImageComponentImageProps`, and
`ThumbnailImageProps`.

`ImageProps` is primarily the shared contract used by custom thumbnail props.
Its `isSelectable` value is always a required boolean when supplied by
`Gallery`; its style properties are optional because the internal defaults are
valid when callers omit them. `ImageProps.height` is deprecated, unused by the
built-in image component, and will be removed in v2.
