import type { Image, ImageExtendedRow } from '../../src';

export const getFirstRow = <T extends Image>(rows: ImageExtendedRow<T>[]) => {
  const row = rows[0];
  if (!row) {
    throw new Error('Expected layout to contain a row.');
  }
  return row;
};

export const getItemAt = <T extends Image>(
  row: ImageExtendedRow<T>,
  index: number,
) => {
  const item = row[index];
  if (!item) {
    throw new Error(
      `Expected row to contain an item at index ${String(index)}.`,
    );
  }
  return item;
};
