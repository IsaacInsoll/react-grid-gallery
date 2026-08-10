# Migrating from `react-grid-gallery`

The fork preserves the original component API for supported modern React
projects. Most applications only need to change the package and import name.

If you already use upstream `1.x`, start with the install and import change
below, then review the environment, row-sizing, and linked-tile sections for the
few intentional differences. Applications on `0.5.x` should also follow the
historical upgrade guidance at the end of this page.

```sh
npm uninstall react-grid-gallery
npm install @picr/react-grid-gallery
```

```diff
- import { Gallery } from 'react-grid-gallery';
+ import { Gallery } from '@picr/react-grid-gallery';
```

## Environment Changes

For applications already using a modern ESM React toolchain from late 2024
onward—React 18+, Node.js 22+, and TypeScript 5.5+ when applicable—the fork will
usually be a package-name change rather than an environment migration.

| Area           | `react-grid-gallery`                                             | `@picr/react-grid-gallery`                       |
| -------------- | ---------------------------------------------------------------- | ------------------------------------------------ |
| React          | React 16.14 or newer                                             | React 18 or 19                                   |
| Module formats | CommonJS, ESM, and UMD                                           | ESM only                                         |
| Browser output | Legacy ES5/UMD build available                                   | ES2020 ESM for modern browsers                   |
| Node.js        | No declared package minimum                                      | Node.js 22 or newer                              |
| TypeScript     | Declarations included                                            | TypeScript 5.5 minimum; also tested with 6 and 7 |
| Imports        | Historical source and distribution paths may have been reachable | Package-root imports only                        |

Applications that still require React 16/17, CommonJS `require`, UMD script
tags, Internet Explorer, or other legacy browser output should remain on the
original package. The maintained package does not publish `src`; deep imports
into `src` or `dist` are not supported API contracts.

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

Selected tiles whose shortest rendered dimension is below 64px now reduce the
default 16px selection inset to at most one quarter of that dimension. This
keeps the selected viewport and thumbnail dimensions valid for very short
rescaled rows. It also changes the selection chrome on small tiles that did not
need row rescaling, such as galleries using a `rowHeight` below 64px.

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
available as historical references. Their interaction patterns still apply,
but their code installs and imports the original package; use this maintained
Storybook for current package examples.

The historical Nextra documentation demonstrated both `react-image-lightbox`
and Yet Another React Lightbox. Neither viewer is bundled with this package.
`react-image-lightbox` is no longer the maintained recommendation: keep your
selected index in application state and use the working YARL example in
**Storybook / Advanced / Viewer integration**, or apply the same provider-neutral
`onClick` pattern to another current viewer.
