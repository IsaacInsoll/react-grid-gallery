# @picr/react-grid-gallery

A justified image gallery component for modern React applications.

This project is a maintained fork of
[`benhowell/react-grid-gallery`](https://github.com/benhowell/react-grid-gallery).
It preserves the original component API and complete inherited Git history
while providing modern packaging, TypeScript declarations, and maintained test
coverage. The original author and contributors remain credited in
[ACKNOWLEDGEMENTS.md](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/ACKNOWLEDGEMENTS.md).

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

export const PhotoGallery = () => <Gallery images={images} />;
```

The gallery fills the width of its containing element. Give that container a
width before rendering the gallery. Supply `defaultContainerWidth` when server
rendering requires deterministic initial markup.

## Documentation

- [API reference](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/docs/API.md)
- [Migration from `react-grid-gallery`](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/docs/MIGRATION.md)
- [Original contributors and image credits](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/ACKNOWLEDGEMENTS.md)
- [Original upstream demos](https://benhowell.github.io/react-grid-gallery/)
  (these use the original package; a maintained Storybook site is tracked
  separately)

## Project

Contributions are welcome; see
[CONTRIBUTING.md](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/CONTRIBUTING.md).
Report security issues privately as described in
[SECURITY.md](https://github.com/IsaacInsoll/react-grid-gallery/blob/main/SECURITY.md),
and use
[GitHub issues](https://github.com/IsaacInsoll/react-grid-gallery/issues) for
ordinary bugs and feature requests.

The fork remains MIT licensed and preserves Ben Howell's original authorship.
Isaac Insoll maintains this scoped continuation. A courtesy request was posted
to the original maintainer in
[upstream issue #375](https://github.com/benhowell/react-grid-gallery/issues/375#issuecomment-5111298046);
this project does not claim endorsement or a transfer of the original package.
