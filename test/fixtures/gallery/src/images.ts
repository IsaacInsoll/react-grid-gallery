const colorImage = (hex: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1" preserveAspectRatio="none"><path fill="#${hex}" d="M0 0h1v1H0z"/></svg>`,
  )}`;

export const images = [
  {
    src: colorImage('E14F5D'),
    width: 320,
    height: 174,
    caption: 'After Rain (Jeshu John - designerspics.com)',
  },
  {
    src: colorImage('FFC349'),
    width: 320,
    height: 212,
    caption: 'Boats (Jeshu John - designerspics.com)',
  },
  {
    src: colorImage('A6BC3E'),
    width: 320,
    height: 212,
    caption: 'Color Pencils (Jeshu John - designerspics.com)',
  },
  {
    src: colorImage('92A43B'),
    width: 320,
    height: 213,
    caption: 'Red Apples with other Red Fruit (foodiesfeed.com)',
  },
  {
    src: colorImage('1873D3'),
    width: 320,
    height: 183,
    caption: '37H (gratispgraphy.com)',
  },
  {
    src: colorImage('FFE787'),
    width: 240,
    height: 320,
    caption: '8H (gratisography.com)',
  },
  {
    src: colorImage('FFF8BC'),
    width: 320,
    height: 190,
    caption: '286H (gratisography.com)',
  },
  {
    src: colorImage('FFAF92'),
    width: 320,
    height: 148,
    caption: '315H (gratisography.com)',
  },
  {
    src: colorImage('FF876F'),
    width: 320,
    height: 213,
    caption: '201H (gratisography.com)',
  },
  {
    alt: 'Big Ben - London',
    src: colorImage('492742'),
    width: 248,
    height: 320,
    caption: 'Big Ben (Tom Eversley - isorepublic.com)',
  },
  {
    alt: 'Red Zone - Paris',
    src: colorImage('E14F5D'),
    width: 320,
    height: 113,
    caption: 'Red Zone - Paris (Tom Eversley - isorepublic.com)',
  },
  {
    alt: 'Wood Glass',
    src: colorImage('FFC349'),
    width: 313,
    height: 320,
    caption: 'Wood Glass (Tom Eversley - isorepublic.com)',
  },
  {
    src: colorImage('A6BC3E'),
    width: 320,
    height: 213,
    caption: 'Flower Interior Macro (Tom Eversley - isorepublic.com)',
  },
  {
    src: colorImage('92A43B'),
    width: 320,
    height: 194,
    caption: 'Old Barn (Tom Eversley - isorepublic.com)',
  },
  {
    src: colorImage('FFF8BC'),
    width: 320,
    height: 213,
    caption: 'Cosmos Flower Macro (Tom Eversley - isorepublic.com)',
  },
  {
    src: colorImage('FFC562'),
    width: 271,
    height: 320,
    caption: 'Orange Macro (Tom Eversley - isorepublic.com)',
  },
  {
    src: colorImage('FF6D74'),
    width: 320,
    height: 213,
    caption: 'Surfer Sunset (Tom Eversley - isorepublic.com)',
  },
  {
    src: colorImage('4FDDC3'),
    width: 320,
    height: 213,
    caption: 'Man on BMX (Tom Eversley - isorepublic.com)',
  },
  {
    src: colorImage('61A8E8'),
    width: 320,
    height: 213,
    caption: 'Ropeman - Thailand (Tom Eversley - isorepublic.com)',
  },
  {
    src: colorImage('A2E0DB'),
    width: 320,
    height: 213,
    caption: 'Time to Think (Tom Eversley - isorepublic.com)',
  },
  {
    src: colorImage('FEE1D3'),
    width: 320,
    height: 179,
    caption: 'Untitled (Jan Vasek - jeshoots.com)',
  },
  {
    src: colorImage('F55E55'),
    width: 320,
    height: 215,
    caption: 'Untitled (moveast.me)',
  },
  {
    src: colorImage('FF857A'),
    width: 257,
    height: 320,
    caption: 'A photo by 贝莉儿 NG. (unsplash.com)',
  },
  {
    src: colorImage('492742'),
    width: 226,
    height: 320,
    caption: 'A photo by Matthew Wiebe. (unsplash.com)',
  },
];
