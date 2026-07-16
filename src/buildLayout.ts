import type {
  ImageExtended,
  Image,
  BuildLayoutOptions,
  ImageExtendedRow,
} from './types';

type NormalizedBuildLayoutOptions = BuildLayoutOptions & {
  rowHeight: number;
  margin: number;
};

const getRow = <T extends Image = Image>(
  images: T[],
  { containerWidth, rowHeight, margin }: NormalizedBuildLayoutOptions,
): [ImageExtendedRow<T>, T[]] => {
  const row: ImageExtendedRow<T> = [];
  const imgMargin = 2 * margin;
  const items = [...images];

  let totalRowWidth = 0;
  while (items.length > 0 && totalRowWidth < containerWidth) {
    const item = items.shift();
    if (!item) break;

    const scaledWidth = Math.floor(rowHeight * (item.width / item.height));
    const extendedItem: ImageExtended<T> = {
      ...item,
      scaledHeight: rowHeight,
      scaledWidth,
      viewportWidth: scaledWidth,
      marginLeft: 0,
    };
    row.push(extendedItem);
    totalRowWidth += extendedItem.scaledWidth + imgMargin;
  }

  // Justify by rescaling the whole row to fit the container instead of
  // horizontally cropping each image.
  const protrudingWidth = totalRowWidth - containerWidth;
  if (row.length > 0 && protrudingWidth > 0) {
    const marginsWidth = row.length * imgMargin;
    const availableWidth = containerWidth - marginsWidth;
    const naturalWidth = totalRowWidth - marginsWidth;
    const scale = availableWidth / naturalWidth;
    const scaledRowHeight = Math.floor(rowHeight * scale);
    let usedWidth = 0;

    for (const item of row) {
      item.scaledHeight = scaledRowHeight;
      item.scaledWidth = Math.floor(item.scaledWidth * scale);
      usedWidth += item.scaledWidth;
    }

    // Hand the flooring remainder back one pixel at a time so the row fills
    // the container without overflowing and breaking flex-wrap alignment.
    let leftover = availableWidth - usedWidth;
    for (const item of row) {
      if (leftover <= 0) break;
      item.scaledWidth += 1;
      leftover -= 1;
    }

    for (const item of row) {
      item.viewportWidth = item.scaledWidth;
      item.marginLeft = 0;
    }
  }

  return [row, items];
};

const getRows = <T extends Image = Image>(
  images: T[],
  options: NormalizedBuildLayoutOptions,
  rows: ImageExtendedRow<T>[] = [],
): ImageExtendedRow<T>[] => {
  const [row, imagesLeft] = getRow(images, options);
  const nextRows = [...rows, row];

  if (options.maxRows && nextRows.length >= options.maxRows) {
    return nextRows;
  }
  if (imagesLeft.length) {
    return getRows(imagesLeft, options, nextRows);
  }
  return nextRows;
};

export const buildLayout = <T extends Image = Image>(
  images: T[],
  { containerWidth, maxRows, rowHeight = 180, margin = 2 }: BuildLayoutOptions,
): ImageExtendedRow<T>[] => {
  // Retain a defensive runtime guard for untyped JavaScript consumers.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!images) return [];
  if (!containerWidth) return [];

  const options = { containerWidth, maxRows, rowHeight, margin };
  return getRows(images, options);
};

export const buildLayoutFlat = <T extends Image = Image>(
  images: T[],
  options: BuildLayoutOptions,
): ImageExtendedRow<T> => {
  const rows = buildLayout(images, options);
  return rows.reduce<ImageExtendedRow<T>>(
    (items, row) => items.concat(row),
    [],
  );
};
