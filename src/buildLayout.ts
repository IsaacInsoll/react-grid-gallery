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

const calculateCutOff = (
  items: ImageExtended[],
  totalRowWidth: number,
  protrudingWidth: number,
) => {
  const cutOff: number[] = [];
  let cutSum = 0;
  items.forEach((item, index) => {
    const fractionOfWidth = item.scaledWidth / totalRowWidth;
    cutOff[index] = Math.floor(fractionOfWidth * protrudingWidth);
    cutSum += cutOff[index];
  });

  let stillToCutOff = protrudingWidth - cutSum;
  while (stillToCutOff > 0) {
    for (const i of cutOff.keys()) {
      cutOff[i]++;
      stillToCutOff--;
      if (stillToCutOff < 0) break;
    }
  }
  return cutOff;
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

  const protrudingWidth = totalRowWidth - containerWidth;
  if (row.length > 0 && protrudingWidth > 0) {
    const cutoff = calculateCutOff(row, totalRowWidth, protrudingWidth);
    for (const i of row.keys()) {
      const pixelsToRemove = cutoff[i];
      const item = row[i];
      item.marginLeft = -Math.abs(Math.floor(pixelsToRemove / 2));
      item.viewportWidth = item.scaledWidth - pixelsToRemove;
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
