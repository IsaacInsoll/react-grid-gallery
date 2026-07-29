import { Gallery } from '@picr/react-grid-gallery';
import type { Image } from '@picr/react-grid-gallery';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

const images: Image[] = [
  {
    src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
    width: 1,
    height: 1,
    alt: 'Packed consumer fixture',
  },
];
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Packed consumer root element was not found.');
}

createRoot(rootElement).render(
  <StrictMode>
    <Gallery images={images} defaultContainerWidth={320} />
  </StrictMode>,
);
