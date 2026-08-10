import type {
  ImageExtended,
  Image,
  BuildLayoutOptions,
  BuildMasonryLayoutOptions,
  ImageExtendedRow,
  MasonryLayout,
} from './types';

type NormalizedBuildLayoutOptions = BuildLayoutOptions & {
  rowHeight: number;
  margin: number;
};

export const DEFAULT_MASONRY_COLUMN_WIDTH = 180;
export const DEFAULT_MASONRY_MARGIN = 2;

export const normalizeMasonryOptions = ({
  containerWidth,
  columnWidth = DEFAULT_MASONRY_COLUMN_WIDTH,
  margin = DEFAULT_MASONRY_MARGIN,
}: BuildMasonryLayoutOptions): Required<BuildMasonryLayoutOptions> => {
  const safeColumnWidth =
    Number.isFinite(columnWidth) && columnWidth >= 1
      ? Math.floor(columnWidth)
      : DEFAULT_MASONRY_COLUMN_WIDTH;
  const requestedMargin =
    Number.isFinite(margin) && margin >= 0 ? margin : DEFAULT_MASONRY_MARGIN;
  const maxMargin = Math.max(0, Math.floor(containerWidth / 2));
  const safeMargin = Math.min(requestedMargin, maxMargin);

  return {
    containerWidth,
    columnWidth: safeColumnWidth,
    margin: safeMargin,
  };
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
    const availableWidth = Math.max(
      0,
      Math.floor(containerWidth - marginsWidth),
    );
    const naturalWidth = totalRowWidth - marginsWidth;
    const scale = naturalWidth > 0 ? availableWidth / naturalWidth : 0;
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
  if (!Number.isFinite(containerWidth) || containerWidth <= 0) return [];

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

export const buildMasonryLayout = <T extends Image = Image>(
  images: T[],
  options: BuildMasonryLayoutOptions,
): MasonryLayout<T> => {
  // Retain defensive runtime guards for untyped JavaScript consumers.
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!images) return [];
  if (
    !Number.isFinite(options.containerWidth) ||
    options.containerWidth <= 0 ||
    images.length === 0
  ) {
    return [];
  }

  const { containerWidth, columnWidth, margin } =
    normalizeMasonryOptions(options);
  const footprint = columnWidth + margin * 2;
  const targetColumnCount = Math.max(1, Math.floor(containerWidth / footprint));
  const columnCount = Math.min(images.length, targetColumnCount);
  const availableWidth = containerWidth - targetColumnCount * margin * 2;
  const actualColumnWidth = Math.floor(availableWidth / targetColumnCount);
  const columns: MasonryLayout<T> = Array.from(
    { length: columnCount },
    () => [],
  );
  const columnHeights = Array.from({ length: columnCount }, () => 0);

  images.forEach((image, originalIndex) => {
    let shortestColumnIndex = 0;
    for (
      let columnIndex = 1;
      columnIndex < columnHeights.length;
      columnIndex += 1
    ) {
      if (
        (columnHeights[columnIndex] ?? Number.POSITIVE_INFINITY) <
        (columnHeights[shortestColumnIndex] ?? Number.POSITIVE_INFINITY)
      ) {
        shortestColumnIndex = columnIndex;
      }
    }
    const computedHeight = Math.floor(
      actualColumnWidth * (image.height / image.width),
    );
    const scaledHeight =
      Number.isFinite(computedHeight) && computedHeight > 0
        ? computedHeight
        : actualColumnWidth;
    const column = columns[shortestColumnIndex];
    const columnHeight = columnHeights[shortestColumnIndex];
    if (!column || columnHeight === undefined) return;

    column.push({
      ...image,
      originalIndex,
      scaledHeight,
      scaledWidth: actualColumnWidth,
      viewportWidth: actualColumnWidth,
      marginLeft: 0,
    });
    columnHeights[shortestColumnIndex] =
      columnHeight + scaledHeight + margin * 2;
  });

  return columns;
};
