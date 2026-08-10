import type { Image } from '@picr/react-grid-gallery';
import dogBallBlue from './assets/dogs/xh2a2139.webp';
import dogGlasses from './assets/dogs/xh2a2143.webp';
import dogBallCatch from './assets/dogs/xh2a2179.webp';
import dogsAtPark from './assets/dogs/xh2a8246.webp';
import dogsWithHandler from './assets/dogs/xh2a8265.webp';
import dogRedBall from './assets/dogs/xh2a8309.webp';
import dogCuddle from './assets/dogs/xh2a8337.webp';
import dogParkPortrait from './assets/dogs/xh2a8343.webp';
import dogCloseUp from './assets/dogs/xh2a8360.webp';
import dogBirthday from './assets/dogs/xt4b2260.webp';
import dogBallBlueFull from './assets/dogs/full/XH2A2139.jpg';
import dogGlassesFull from './assets/dogs/full/XH2A2143.jpg';
import dogBallCatchFull from './assets/dogs/full/XH2A2179.jpg';
import dogsAtParkFull from './assets/dogs/full/XH2A8246.jpg';
import dogsWithHandlerFull from './assets/dogs/full/XH2A8265.jpg';
import dogRedBallFull from './assets/dogs/full/XH2A8309.jpg';
import dogCuddleFull from './assets/dogs/full/XH2A8337.jpg';
import dogParkPortraitFull from './assets/dogs/full/XH2A8343.jpg';
import dogCloseUpFull from './assets/dogs/full/XH2A8360.jpg';
import dogBirthdayFull from './assets/dogs/full/XT4B2260.jpg';
import dogBallBlueNano from './assets/dogs/nano/xh2a2139.webp?inline';
import dogGlassesNano from './assets/dogs/nano/xh2a2143.webp?inline';
import dogBallCatchNano from './assets/dogs/nano/xh2a2179.webp?inline';
import dogsAtParkNano from './assets/dogs/nano/xh2a8246.webp?inline';
import dogsWithHandlerNano from './assets/dogs/nano/xh2a8265.webp?inline';
import dogRedBallNano from './assets/dogs/nano/xh2a8309.webp?inline';
import dogCuddleNano from './assets/dogs/nano/xh2a8337.webp?inline';
import dogParkPortraitNano from './assets/dogs/nano/xh2a8343.webp?inline';
import dogCloseUpNano from './assets/dogs/nano/xh2a8360.webp?inline';
import dogBirthdayNano from './assets/dogs/nano/xt4b2260.webp?inline';

export interface DemoImage extends Image {
  id: string;
  collection: 'Coast' | 'Field notes' | 'Night';
  accent: string;
}

export interface DogPhoto extends Image {
  id: string;
  fullSrc: string;
  fullWidth: number;
  fullHeight: number;
  filename: string;
  album: 'Park day' | 'Studio portraits' | 'Birthday';
  isFavorite: boolean;
  status: 'published' | 'processing';
}

type Artwork = {
  id: string;
  width: number;
  height: number;
  colors: [string, string, string];
  alt: string;
  collection: DemoImage['collection'];
};

const artworkDataUri = (index: number, { width, height, colors }: Artwork) => {
  const [start, end, accent] = colors;
  const horizon = Math.round(height * (0.55 + (index % 3) * 0.06));
  const orbX = Math.round(width * (0.2 + (index % 4) * 0.18));
  const orbY = Math.round(height * (0.2 + (index % 2) * 0.12));
  const orbRadius = Math.round(Math.min(width, height) * 0.14);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${String(width)} ${String(height)}" preserveAspectRatio="xMidYMid slice"><defs><linearGradient id="g${String(index)}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${start}"/><stop offset="1" stop-color="${end}"/></linearGradient><filter id="b${String(index)}"><feGaussianBlur stdDeviation="${String(Math.max(10, Math.round(width / 28)))}"/></filter></defs><path fill="url(#g${String(index)})" d="M0 0h${String(width)}v${String(height)}H0z"/><circle cx="${String(orbX)}" cy="${String(orbY)}" r="${String(orbRadius)}" fill="${accent}" opacity=".92"/><circle cx="${String(width - orbX / 2)}" cy="${String(height * 0.22)}" r="${String(orbRadius * 1.4)}" fill="#fff" opacity=".16" filter="url(#b${String(index)})"/><path fill="${accent}" opacity=".32" d="M0 ${String(horizon)}C${String(width * 0.2)} ${String(horizon - height * 0.16)} ${String(width * 0.36)} ${String(horizon + height * 0.12)} ${String(width * 0.55)} ${String(horizon - height * 0.04)}S${String(width * 0.86)} ${String(horizon - height * 0.08)} ${String(width)} ${String(horizon + height * 0.03)}V${String(height)}H0Z"/><path fill="#fff" opacity=".16" d="M0 ${String(horizon + height * 0.15)}C${String(width * 0.28)} ${String(horizon - height * 0.02)} ${String(width * 0.56)} ${String(horizon + height * 0.28)} ${String(width)} ${String(horizon + height * 0.08)}V${String(height)}H0Z"/></svg>`;

  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

const artwork: Artwork[] = [
  {
    id: 'afterglow',
    width: 720,
    height: 480,
    colors: ['#ff8a68', '#7136d9', '#ffd166'],
    alt: 'Abstract sunset in coral, violet, and gold',
    collection: 'Coast',
  },
  {
    id: 'lagoon',
    width: 640,
    height: 800,
    colors: ['#18a999', '#0b4f6c', '#9ffcdf'],
    alt: 'Abstract lagoon in teal and deep blue',
    collection: 'Coast',
  },
  {
    id: 'orchard',
    width: 960,
    height: 540,
    colors: ['#9bbf4a', '#2f6b4f', '#f3d86b'],
    alt: 'Abstract orchard in leaf green and yellow',
    collection: 'Field notes',
  },
  {
    id: 'terracotta',
    width: 560,
    height: 700,
    colors: ['#d96c4f', '#793f5c', '#ffc08a'],
    alt: 'Abstract terracotta landscape',
    collection: 'Field notes',
  },
  {
    id: 'blue-hour',
    width: 880,
    height: 580,
    colors: ['#3155a5', '#171b4d', '#82c9ff'],
    alt: 'Abstract blue-hour landscape',
    collection: 'Night',
  },
  {
    id: 'citrus',
    width: 760,
    height: 460,
    colors: ['#ffb703', '#e85d04', '#fff1a8'],
    alt: 'Abstract citrus study in amber and orange',
    collection: 'Field notes',
  },
  {
    id: 'tidepool',
    width: 520,
    height: 760,
    colors: ['#38b2ac', '#3761a8', '#b8fff4'],
    alt: 'Abstract tidepool in turquoise and cobalt',
    collection: 'Coast',
  },
  {
    id: 'mulberry',
    width: 920,
    height: 520,
    colors: ['#823c82', '#351c4d', '#f4a8ce'],
    alt: 'Abstract night garden in mulberry and rose',
    collection: 'Night',
  },
  {
    id: 'moss',
    width: 680,
    height: 680,
    colors: ['#52796f', '#243b32', '#cadf9e'],
    alt: 'Abstract moss study in forest green',
    collection: 'Field notes',
  },
  {
    id: 'cloudline',
    width: 1000,
    height: 500,
    colors: ['#a9d6e5', '#467a9f', '#f4fbff'],
    alt: 'Abstract cloud line in pale and steel blue',
    collection: 'Coast',
  },
  {
    id: 'ember',
    width: 600,
    height: 780,
    colors: ['#ef476f', '#6a255f', '#ffd3a5'],
    alt: 'Abstract ember study in red and plum',
    collection: 'Night',
  },
  {
    id: 'daybreak',
    width: 860,
    height: 600,
    colors: ['#ffd166', '#ef8354', '#fff4c2'],
    alt: 'Abstract daybreak in yellow and coral',
    collection: 'Coast',
  },
];

export const demoImages: DemoImage[] = artwork.map((item, index) => ({
  id: item.id,
  key: item.id,
  src: artworkDataUri(index, item),
  width: item.width,
  height: item.height,
  alt: item.alt,
  caption: item.alt,
  collection: item.collection,
  accent: item.colors[2],
}));

export const transparentImage =
  'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

export const dogPhotos: DogPhoto[] = [
  {
    id: 'ball-blue',
    key: 'ball-blue',
    src: dogBallBlue,
    fullSrc: dogBallBlueFull,
    fullWidth: 4035,
    fullHeight: 5691,
    nano: dogBallBlueNano,
    width: 1134,
    height: 1600,
    filename: 'XH2A2139.jpg',
    alt: 'Black-and-white dog holding an orange and blue ball',
    caption: 'Ball practice on blue',
    album: 'Studio portraits',
    isFavorite: true,
    status: 'published',
  },
  {
    id: 'round-glasses',
    key: 'round-glasses',
    src: dogGlasses,
    fullSrc: dogGlassesFull,
    fullWidth: 2645,
    fullHeight: 3967,
    nano: dogGlassesNano,
    width: 1067,
    height: 1600,
    filename: 'XH2A2143.jpg',
    alt: 'Black-and-white dog wearing round glasses on purple',
    caption: 'The intellectual',
    album: 'Studio portraits',
    isFavorite: true,
    status: 'published',
  },
  {
    id: 'ball-catch',
    key: 'ball-catch',
    src: dogBallCatch,
    fullSrc: dogBallCatchFull,
    fullWidth: 2915,
    fullHeight: 4372,
    nano: dogBallCatchNano,
    width: 1067,
    height: 1600,
    filename: 'XH2A2179.jpg',
    alt: 'Excited black-and-white dog looking up at an orange ball',
    caption: 'Eyes on the ball',
    album: 'Studio portraits',
    isFavorite: false,
    status: 'published',
  },
  {
    id: 'park-gathering',
    key: 'park-gathering',
    src: dogsAtPark,
    fullSrc: dogsAtParkFull,
    fullWidth: 6360,
    fullHeight: 4240,
    nano: dogsAtParkNano,
    width: 1600,
    height: 1067,
    filename: 'XH2A8246.jpg',
    alt: 'Three dogs gathered around their handler in a park',
    caption: 'A very serious team meeting',
    album: 'Park day',
    isFavorite: false,
    status: 'published',
  },
  {
    id: 'park-rest',
    key: 'park-rest',
    src: dogsWithHandler,
    fullSrc: dogsWithHandlerFull,
    fullWidth: 7728,
    fullHeight: 5152,
    nano: dogsWithHandlerNano,
    width: 1600,
    height: 1067,
    filename: 'XH2A8265.jpg',
    alt: 'Three dogs resting with their handler on grass',
    caption: 'Between takes',
    album: 'Park day',
    isFavorite: true,
    status: 'published',
  },
  {
    id: 'red-ball',
    key: 'red-ball',
    src: dogRedBall,
    fullSrc: dogRedBallFull,
    fullWidth: 5152,
    fullHeight: 7728,
    nano: dogRedBallNano,
    width: 1067,
    height: 1600,
    filename: 'XH2A8309.jpg',
    alt: 'Brown-and-white dog carrying a red ball',
    caption: 'Found it',
    album: 'Park day',
    isFavorite: true,
    status: 'published',
  },
  {
    id: 'park-cuddle',
    key: 'park-cuddle',
    src: dogCuddle,
    fullSrc: dogCuddleFull,
    fullWidth: 5152,
    fullHeight: 7728,
    nano: dogCuddleNano,
    width: 1067,
    height: 1600,
    filename: 'XH2A8337.jpg',
    alt: 'Handler cuddling a brown-and-white dog in the park',
    caption: 'Good dog break',
    album: 'Park day',
    isFavorite: false,
    status: 'published',
  },
  {
    id: 'park-portrait',
    key: 'park-portrait',
    src: dogParkPortrait,
    fullSrc: dogParkPortraitFull,
    fullWidth: 5152,
    fullHeight: 7728,
    nano: dogParkPortraitNano,
    width: 1067,
    height: 1600,
    filename: 'XH2A8343.jpg',
    alt: 'Black-and-white dog looking across a sunny park',
    caption: 'Watching the field',
    album: 'Park day',
    isFavorite: false,
    status: 'processing',
  },
  {
    id: 'happy-close-up',
    key: 'happy-close-up',
    src: dogCloseUp,
    fullSrc: dogCloseUpFull,
    fullWidth: 5152,
    fullHeight: 7728,
    nano: dogCloseUpNano,
    width: 1067,
    height: 1600,
    filename: 'XH2A8360.jpg',
    alt: 'Happy black-and-white dog in a close outdoor portrait',
    caption: 'That is the spot',
    album: 'Park day',
    isFavorite: true,
    status: 'published',
  },
  {
    id: 'birthday-duck',
    key: 'birthday-duck',
    src: dogBirthday,
    fullSrc: dogBirthdayFull,
    fullWidth: 6240,
    fullHeight: 4160,
    nano: dogBirthdayNano,
    width: 1600,
    height: 1067,
    filename: 'XT4B2260.jpg',
    alt: 'Dog in a party hat lying beside a rubber duck and toy telephone',
    caption: 'Birthday communications director',
    album: 'Birthday',
    isFavorite: true,
    status: 'published',
  },
];
