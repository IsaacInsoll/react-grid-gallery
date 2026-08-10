export const galleryArgTypes = {
  images: {
    control: false,
    description: 'Image data. See the API reference for the full shape.',
    table: { category: 'Data' },
  },
  id: {
    control: 'text',
    description: 'DOM id for the gallery root.',
    table: {
      category: 'General',
      defaultValue: { summary: 'ReactGridGallery' },
    },
  },
  enableImageSelection: {
    control: 'boolean',
    description: 'Show the built-in selection controls.',
    table: { category: 'Selection', defaultValue: { summary: 'true' } },
  },
  layout: {
    control: 'inline-radio',
    options: ['justified', 'masonry'],
    description: 'Choose responsive justified rows or masonry columns.',
    table: { category: 'Layout', defaultValue: { summary: 'justified' } },
  },
  rowHeight: {
    control: { type: 'range', min: 80, max: 320, step: 10 },
    description: 'Target row height in pixels; overflowing rows may shrink.',
    if: { arg: 'layout', neq: 'masonry' },
    table: { category: 'Layout', defaultValue: { summary: '180' } },
  },
  columnWidth: {
    control: { type: 'range', min: 80, max: 320, step: 10 },
    description:
      'Target masonry column width; actual columns fit the container.',
    if: { arg: 'layout', eq: 'masonry' },
    table: { category: 'Layout', defaultValue: { summary: '180' } },
  },
  margin: {
    control: { type: 'range', min: 0, max: 16, step: 1 },
    description: 'Space around each tile in pixels.',
    table: { category: 'Layout', defaultValue: { summary: '2' } },
  },
  maxRows: {
    control: { type: 'range', min: 1, max: 8, step: 1 },
    description: 'Optional maximum number of rendered rows.',
    if: { arg: 'layout', neq: 'masonry' },
    table: { category: 'Layout', defaultValue: { summary: 'unlimited' } },
  },
  defaultContainerWidth: {
    control: false,
    description:
      'Initial server-rendering width. Use the SSR recipe; a client-only control would be immediately replaced by ResizeObserver.',
    table: { category: 'Layout', defaultValue: { summary: '0' } },
  },
  onClick: { control: false, table: { category: 'Callbacks' } },
  onSelect: { control: false, table: { category: 'Callbacks' } },
  tagStyle: { control: false, table: { category: 'Styling' } },
  thumbnailImageComponent: {
    control: false,
    table: { category: 'Rendering' },
  },
  thumbnailStyle: { control: false, table: { category: 'Styling' } },
  tileViewportStyle: { control: false, table: { category: 'Styling' } },
} as const;
