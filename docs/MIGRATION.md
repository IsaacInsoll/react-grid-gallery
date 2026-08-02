# Migrating from `react-grid-gallery`

The fork preserves the original component API for supported modern React
projects. Most applications only need to change the package and import name.

```sh
npm uninstall react-grid-gallery
npm install @picr/react-grid-gallery
```

```diff
- import { Gallery } from 'react-grid-gallery';
+ import { Gallery } from '@picr/react-grid-gallery';
```

## Environment Changes

- React 18 and 19 are supported. React 16 and 17 remain supported by the
  original package instead.
- The package is ESM-only and targets ES2020 browsers. CommonJS `require`, UMD
  script tags, and Internet Explorer are not supported.
- Node.js 22 or newer is the declared package baseline.
- TypeScript 5.5 is the minimum tested consumer compiler. Declarations are also
  tested with the development TypeScript 6 compiler and current TypeScript 7.
- Only package-root imports are supported. `src` is no longer published and
  deep imports into `src` or `dist` are not API contracts.

## Type Corrections

The maintained fork corrects several public declarations without intending
runtime behavior changes:

- `StyleFunction<T>` preserves custom image fields in its `item` context.
- `GalleryProps` style callbacks receive `ImageExtended<T>`, matching the
  custom image fields and calculated layout fields supplied at runtime.
- `ImageProps.tileViewportStyle`, `thumbnailStyle`, and `tagStyle` are optional,
  matching the existing internal defaults.
- `ImageProps.isSelectable` remains a required boolean because `Gallery` always
  supplies one to custom thumbnail components.
- `CheckButtonProps.isSelected` and `isVisible` are optional because the
  exported component provides defaults.
- `ThumbnailImageComponentImageProps.title` remains `string | null` for
  compatibility. Convert `null` to `undefined` when forwarding it to a native
  `<img>`.
- `ThumbnailImageComponentImageProps` no longer includes React's special `key`.
  Spreading `key` through props causes a React 19 warning; custom thumbnail
  components receive `index` separately.

```tsx
const Thumbnail = ({ imageProps }: ThumbnailImageProps) => {
  const { title, ...nativeImageProps } = imageProps;
  return <img {...nativeImageProps} title={title ?? undefined} />;
};
```

## Justified Row Sizing

The maintained fork incorporates the row-fitting correction contributed by
[Olli-Pekka Niskanen](https://github.com/opniskanen) in
[PICR PR #73](https://github.com/IsaacInsoll/PICR/pull/73). Overflowing rows
are proportionally rescaled to the container instead of retaining `rowHeight`
and horizontally cropping each image.

As a result, `rowHeight` is now a target: an overflowing row may render shorter
so the complete image content remains visible. This applies to overflowing
final and single-image rows. Underfilled final rows retain their target height
and natural scaled widths. Row membership, image order, and `maxRows` behavior
are unchanged.

Style callbacks still receive `ImageExtended.marginLeft` for compatibility,
but rescaled rows now report `0`. Consumers that used its former negative value
to infer cropping should instead use `scaledWidth`, `scaledHeight`, and
`viewportWidth` directly.

## Linked Tiles

The maintained fork adds optional `Image.href` support, preserving linked tile
behavior developed in
[PICR](https://github.com/IsaacInsoll/PICR/commit/9646fb329e18f5ffad72de1630bc3d48f4f46aa7).
A non-empty value renders the tile viewport as a native anchor; images without
one keep the inherited `div` markup.

Adding `href` changes a plain viewport click into navigation. Applications
using `Gallery.onClick` for selection, a lightbox, or client-side routing must
call `event.preventDefault()` when they intend to remain on the current page.
The built-in check-button selection control is outside the anchor and remains
unchanged. Modified primary clicks still call `Gallery.onClick` with their
modifier flags. The gallery listens for `click`; browsers dispatch `auxclick`
for middle buttons, so those activations bypass `Gallery.onClick` and retain
native behavior.

Custom thumbnail components are rendered inside the linked viewport. They must
not render anchors, buttons, or other interactive descendants when `href` is
set.

## Historical Upgrades

Applications still on upstream `0.5.x` should first review the original
project's
[`0.5.x` to `1.x` guide](https://github.com/benhowell/react-grid-gallery/blob/master/UPGRADE_GUIDE.md),
which covers the earlier lightbox removal and prop renames. The
[original demos](https://benhowell.github.io/react-grid-gallery/) also remain
available as historical examples, but install and import the original package.
