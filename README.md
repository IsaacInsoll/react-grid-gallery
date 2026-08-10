# @picr/react-grid-gallery

A responsive image gallery component with justified and masonry layouts for
modern React applications.

This project is a maintained fork of
[`benhowell/react-grid-gallery`](https://github.com/benhowell/react-grid-gallery).
It preserves the original component API and complete inherited Git history
while providing modern packaging, TypeScript declarations, and maintained test
coverage. The original author and contributors remain credited in
[ACKNOWLEDGEMENTS.md](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/ACKNOWLEDGEMENTS.md).

**[Documentation and live interactive examples →](https://isaacinsoll.github.io/react-grid-gallery/)**

<a href="https://isaacinsoll.github.io/react-grid-gallery/?path=/docs/examples-gallery-workshop--documentation">
  <img
    src="https://raw.githubusercontent.com/IsaacInsoll/react-grid-gallery/main/docs/assets/gallery-workshop.webp"
    alt="The Gallery workshop showing justified rows, a segmented layout control, a thumbnail-size slider, and ten dog photographs"
    width="900"
  />
</a>

## Compatibility

|                    | `react-grid-gallery`                | `@picr/react-grid-gallery`                |
| ------------------ | ----------------------------------- | ----------------------------------------- |
| Maintenance        | Discontinued by the original author | Maintained fork                           |
| Package and import | `react-grid-gallery`                | `@picr/react-grid-gallery`                |
| React              | 16.14 or newer                      | 18 or 19                                  |
| Modules            | CommonJS, ESM, and UMD              | ESM only                                  |
| Node.js            | No declared package minimum         | 22 or newer                               |
| TypeScript         | Declarations included               | Declarations tested with TS 5.5, 6, and 7 |
| Browser output     | ES5 UMD build available             | ES2020 ESM for modern browsers            |

Choose the original package when an application still requires CommonJS, UMD,
React 16/17, or legacy browsers. Component usage in supported modern
environments should usually require only the package-name change; see the
[migration guide](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/docs/MIGRATION.md)
for the complete packaging and type-level differences.

## Installation

```sh
npm install @picr/react-grid-gallery
```

## Quick Start

```tsx
import { Gallery } from '@picr/react-grid-gallery';
import type { Image } from '@picr/react-grid-gallery';

const images: Image[] = [
  {
    src: '/photos/after-rain.jpg',
    width: 320,
    height: 174,
    alt: 'Rain clouds clearing over a field',
  },
  {
    src: '/photos/boats.jpg',
    width: 320,
    height: 212,
    alt: 'Boats on the water',
    tags: [{ value: 'Featured', title: 'Featured' }],
  },
];

export const PhotoGallery = () => (
  <Gallery images={images} enableImageSelection={false} />
);
```

`src` is passed to a native `<img>` element, so local images work the same way
they do elsewhere in React: use a public/static URL such as
`/photos/after-rain.jpg`, or import an asset with your bundler and pass the
imported URL. The `width` and `height` fields are the image's intrinsic pixel
dimensions and are used to preserve aspect ratio; they do not set the rendered
thumbnail size.

Choose a layout with the `layout` prop:

```tsx
<Gallery images={images} layout="justified" rowHeight={180} />
<Gallery images={images} layout="masonry" columnWidth={180} />
```

The gallery fills the width of its containing element. Give that container a
width before rendering the gallery. Image `width` and `height` values describe
intrinsic aspect ratios, so the ratio must be accurate even when the delivered
file has different pixel dimensions. Supply `defaultContainerWidth` when server
rendering requires deterministic initial markup. Control rendered thumbnail
sizing with layout props such as `rowHeight`, `columnWidth`, and `margin`, or
with a custom thumbnail component.

## Documentation

- [Live Storybook demos and developer guides](https://isaacinsoll.github.io/react-grid-gallery/)
- [API reference](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/docs/API.md)
- [Migration from `react-grid-gallery`](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/docs/MIGRATION.md)
- [Acknowledgements](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/ACKNOWLEDGEMENTS.md)
  (historical examples that use the original package)

## Project

Contributions are welcome; see
[CONTRIBUTING.md](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/CONTRIBUTING.md)
and the high-level
[testing guide](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/docs/TESTING.md).
Report security issues privately as described in
[SECURITY.md](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/SECURITY.md),
and use
[GitHub issues](https://github.com/IsaacInsoll/react-grid-gallery/issues) for
ordinary bugs and feature requests.

The fork remains MIT licensed and preserves Ben Howell's original authorship.
Isaac Insoll maintains this scoped continuation. After the courtesy request in
[upstream issue #375](https://github.com/benhowell/react-grid-gallery/issues/375#issuecomment-5111298046),
Ben Howell
[welcomed the fork](https://github.com/benhowell/react-grid-gallery/issues/375#issuecomment-5113695157)
and [invited a link to it](https://github.com/benhowell/react-grid-gallery/issues/375#issuecomment-5113879264).
This does not transfer the original package or imply ongoing endorsement.
